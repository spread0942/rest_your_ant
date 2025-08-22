import { Request, Response, NextFunction } from 'express';
import { Order, Restaurant, Table, Account, OrderDetail, Plate, Drink } from '../models';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import sequelize from '../config/database';

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const transaction = await sequelize.transaction();
  
  try {
    const { restaurantId, tableId, accountId, status, notes, orderDate, items } = req.body;

    // Validate restaurant exists
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      await transaction.rollback();
      res.status(404).json(createErrorResponse('Restaurant not found'));
      return;
    }

    // Validate table if provided
    if (tableId) {
      const table = await Table.findByPk(tableId);
      if (!table) {
        await transaction.rollback();
        res.status(404).json(createErrorResponse('Table not found'));
        return;
      }
    }

    // Validate account if provided
    if (accountId) {
      const account = await Account.findByPk(accountId);
      if (!account) {
        await transaction.rollback();
        res.status(404).json(createErrorResponse('Account not found'));
        return;
      }
    }

    // Calculate total amount from items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items || []) {
      let unitPrice = 0;
      
      if (item.plateId) {
        const plate = await Plate.findByPk(item.plateId);
        if (!plate) {
          await transaction.rollback();
          res.status(404).json(createErrorResponse(`Plate with id ${item.plateId} not found`));
          return;
        }
        unitPrice = Number(plate.price);
      } else if (item.drinkId) {
        const drink = await Drink.findByPk(item.drinkId);
        if (!drink) {
          await transaction.rollback();
          res.status(404).json(createErrorResponse(`Drink with id ${item.drinkId} not found`));
          return;
        }
        unitPrice = Number(drink.price);
      }

      const subtotal = unitPrice * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        plateId: item.plateId || null,
        drinkId: item.drinkId || null,
        quantity: item.quantity,
        unitPrice,
        subtotal,
        notes: item.notes || null,
      });
    }

    // Create order
    const order = await Order.create({
      restaurantId,
      tableId,
      accountId,
      status,
      totalAmount,
      notes,
      orderDate: orderDate || new Date(),
    }, { transaction });

    // Create order details
    const orderDetails = await OrderDetail.bulkCreate(
      orderItems.map(item => ({
        orderId: order.id,
        ...item,
      })),
      { transaction }
    );

    await transaction.commit();

    // Fetch the complete order with associations
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        { model: Restaurant, as: 'restaurant' },
        { model: Table, as: 'table' },
        { model: Account, as: 'account', attributes: { exclude: ['password'] } },
        {
          model: OrderDetail,
          as: 'details',
          include: [
            { model: Plate, as: 'plate' },
            { model: Drink, as: 'drink' },
          ],
        },
      ],
    });

    res.status(201).json(createSuccessResponse(completeOrder, 'Order created successfully'));
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 10, restaurantId, status, tableId } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (restaurantId) whereClause.restaurantId = Number(restaurantId);
    if (status) whereClause.status = status;
    if (tableId) whereClause.tableId = Number(tableId);

    const { count, rows } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        { model: Restaurant, as: 'restaurant' },
        { model: Table, as: 'table' },
        { model: Account, as: 'account', attributes: { exclude: ['password'] } },
      ],
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json(createSuccessResponse({
      orders: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    }, 'Orders retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        { model: Restaurant, as: 'restaurant' },
        { model: Table, as: 'table' },
        { model: Account, as: 'account', attributes: { exclude: ['password'] } },
        {
          model: OrderDetail,
          as: 'details',
          include: [
            { model: Plate, as: 'plate' },
            { model: Drink, as: 'drink' },
          ],
        },
      ],
    });

    if (!order) {
      res.status(404).json(createErrorResponse('Order not found'));
      return;
    }

    res.json(createSuccessResponse(order, 'Order retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { restaurantId, tableId, accountId, status, notes, orderDate } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      res.status(404).json(createErrorResponse('Order not found'));
      return;
    }

    // Validate references if provided
    if (restaurantId) {
      const restaurant = await Restaurant.findByPk(restaurantId);
      if (!restaurant) {
        res.status(404).json(createErrorResponse('Restaurant not found'));
        return;
      }
    }

    if (tableId) {
      const table = await Table.findByPk(tableId);
      if (!table) {
        res.status(404).json(createErrorResponse('Table not found'));
        return;
      }
    }

    if (accountId) {
      const account = await Account.findByPk(accountId);
      if (!account) {
        res.status(404).json(createErrorResponse('Account not found'));
        return;
      }
    }

    await order.update({
      restaurantId: restaurantId || order.restaurantId,
      tableId: tableId !== undefined ? tableId : order.tableId,
      accountId: accountId !== undefined ? accountId : order.accountId,
      status,
      notes,
      orderDate,
    });

    const updatedOrder = await Order.findByPk(order.id, {
      include: [
        { model: Restaurant, as: 'restaurant' },
        { model: Table, as: 'table' },
        { model: Account, as: 'account', attributes: { exclude: ['password'] } },
        {
          model: OrderDetail,
          as: 'details',
          include: [
            { model: Plate, as: 'plate' },
            { model: Drink, as: 'drink' },
          ],
        },
      ],
    });

    res.json(createSuccessResponse(updatedOrder, 'Order updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) {
      res.status(404).json(createErrorResponse('Order not found'));
      return;
    }

    await order.destroy();
    res.json(createSuccessResponse(null, 'Order deleted successfully'));
  } catch (error) {
    next(error);
  }
};

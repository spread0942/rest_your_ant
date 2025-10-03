import { Request, Response, NextFunction } from 'express';
import { Auth, Order, Restaurant, Table, Account, Plate, Drink, OrderPlates, OrderPlateProducts, OrderDrinks, Product } from '../models';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import sequelize from '../config/database';

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { restaurantId, tableId, status, notes } = req.body;
    const auth = (req as any).auth as Auth;
    
    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    // Validate restaurant
    const restaurant = await Restaurant.findOne({
      where: { id: restaurantId, tenantId: auth.tenantId },
    });
    if (!restaurant) {
      res.status(404).json(createErrorResponse('Restaurant not found'));
      return;
    }

    // Validate table if provided
    if (tableId) {
      const table = await Table.findOne({
        where: { id: tableId, restaurantId },
        include: [{ model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } }],
      });
      if (!table) {
        res.status(404).json(createErrorResponse('Table not found'));
        return;
      }
    }

    const order = await Order.create({
      restaurantId,
      tableId: tableId || null,
      status: status || 'pending',
      notes: notes || null,
      totalAmount: 0,
    });

    const newOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: Restaurant,
          as: 'restaurant',
          where: { tenantId: auth.tenantId },
          attributes: { include: ['id', 'name'] },
        },
        {
          model: Table,
          as: 'table',
          required: false,
          where: { restaurantId: auth.tenantId },
          // TODO: attributes: { include: ['id', 'number', 'seats'] },
        },
      ],
    });

    res.status(201).json(createSuccessResponse(newOrder, 'Order created successfully'));
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 10, restaurantId, status, tableId } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const auth = (req as any).auth as Auth;

    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    // Build where clause based on filters
    const whereClause: any = {};
    if (restaurantId) whereClause.restaurantId = Number(restaurantId);
    if (status) whereClause.status = status;
    if (tableId) whereClause.tableId = Number(tableId);

    const { count, rows } = await Order.findAndCountAll({
      where: whereClause,
        include: [
        {
          model: Restaurant,
          as: 'restaurant',
          where: { tenantId: auth.tenantId },
          attributes: { include: ['id', 'name'] },
        },
        {
          model: Table,
          as: 'table',
          required: false,
          where: { restaurantId: auth.tenantId },
          // TODO: attributes: { include: ['id', 'number', 'seats'] },
        },
        {
          model: OrderPlates,
          as: 'orderPlates',
          required: false,
          include: [
            { model: Plate, as: 'plate', attributes: { include: ['id', 'name'] } },
            { model: OrderPlateProducts, as: 'orderPlateProducts', required: false, include: [{ model: Product, as: 'product', attributes: { include: ['id', 'name'] } }] },
          ],
        },
        { 
          model: OrderDrinks,
          as: 'orderDrinks',
          required: false,
          include: [{ model: Drink, as: 'drink', attributes: { include: ['id', 'name'] } }],
        },
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
    const auth = (req as any).auth as Auth;

    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    const order = await Order.findByPk(id, {
      include: [
        {
          model: Restaurant,
          as: 'restaurant',
          where: { tenantId: auth.tenantId },
          attributes: { include: ['id', 'name'] },
        },
        {
          model: Table,
          as: 'table',
          required: false,
          where: { restaurantId: auth.tenantId },
          // TODO: attributes: { include: ['id', 'number', 'seats'] },
        },
        {
          model: OrderPlates,
          as: 'orderPlates',
          required: false,
          include: [
            { model: Plate, as: 'plate', attributes: { include: ['id', 'name'] } },
            { model: OrderPlateProducts, as: 'orderPlateProducts', required: false, include: [{ model: Product, as: 'product', attributes: { include: ['id', 'name'] } }] },
          ],
        },
        { 
          model: OrderDrinks,
          as: 'orderDrinks',
          required: false,
          include: [{ model: Drink, as: 'drink', attributes: { include: ['id', 'name'] } }],
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
    const { restaurantId, tableId, status, notes, orderDate } = req.body;
    const auth = (req as any).auth as Auth;

    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    const order = await Order.findByPk(id);
    if (!order) {
      res.status(404).json(createErrorResponse('Order not found'));
      return;
    }

    // Validate restaurant
    if (restaurantId) {
      const restaurant = await Restaurant.findOne({
        where: { id: restaurantId, tenantId: auth.tenantId },
      });
      if (!restaurant) {
        res.status(404).json(createErrorResponse('Restaurant not found'));
        return;
      }
    }

    // Validate table if provided
    if (tableId) {
      const table = await Table.findOne({
        where: { id: tableId, restaurantId },
        include: [{ model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } }],
      });
      if (!table) {
        res.status(404).json(createErrorResponse('Table not found'));
        return;
      }
    }

    await order.update({
      restaurantId: restaurantId || order.restaurantId,
      tableId: tableId !== undefined ? tableId : order.tableId, 
      status: status || order.status,
      notes: notes !== undefined ? notes : order.notes,
      orderDate: orderDate || order.orderDate,
    });

    const updatedOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: Restaurant,
          as: 'restaurant',
          where: { tenantId: auth.tenantId },
          attributes: { include: ['id', 'name'] },
        },
        {
          model: Table,
          as: 'table',
          required: false,
          where: { restaurantId: auth.tenantId },
          // TODO: attributes: { include: ['id', 'number', 'seats'] },
        },
        {
          model: OrderPlates,
          as: 'orderPlates',
          required: false,
          include: [
            { model: Plate, as: 'plate', attributes: { include: ['id', 'name'] } },
            { model: OrderPlateProducts, as: 'orderPlateProducts', required: false, include: [{ model: Product, as: 'product', attributes: { include: ['id', 'name'] } }] },
          ],
        },
        { 
          model: OrderDrinks,
          as: 'orderDrinks',
          required: false,
          include: [{ model: Drink, as: 'drink', attributes: { include: ['id', 'name'] } }],
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
    const auth = (req as any).auth as Auth;

    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    const order = await Order.findOne({
      where: { id },
      include: [{ model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } }],
    });
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

export const addPlateToOrder = async (req : Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { plateId, quantity, notes } = req.body;
    const auth = (req as any).auth as Auth;

    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    // Validate order
    const order = await Order.findOne({
      where: { id: orderId },
      include: [{ model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } }],
    });
    if (!order) {
      res.status(404).json(createErrorResponse('Order not found'));
      return;
    }

    // Validate plate
    const plate = await Plate.findOne({
      where: { id: plateId, restaurantId: order.restaurantId },
      include: [{ model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } }],
    });
    if (!plate) {
      res.status(404).json(createErrorResponse('Plate not found'));
      return;
    }

    // Add plate to order within a transaction
    const result = await sequelize.transaction(async (t) => {
      const platePrice = Number(plate.price);
      const orderTotalAmount = Number(order.totalAmount);
      const subtotal = Number((platePrice * quantity).toFixed(2));

      const orderPlate = await OrderPlates.create({
        orderId: order.id,
        plateId: plate.id,
        quantity,
        unitPrice: platePrice,
        subtotal,
        notes: notes || null,
      }, { transaction: t });

      // Update order total amount
      order.totalAmount = Number((orderTotalAmount + subtotal).toFixed(2));
      await order.save({ transaction: t });

      return orderPlate;
    });

    const newOrderPlate = await OrderPlates.findByPk(result.id, {
      include: [{ model: Plate, as: 'plate', attributes: { include: ['id', 'name'] } }],
    });

    res.status(201).json(createSuccessResponse(newOrderPlate, 'Plate added to order successfully'));
  } catch (error) {
    next(error);
  }
};

export const addProductToOrderPlate = async (req : Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { orderPlateId } = req.params;
    const { productId, quantity, action, notes } = req.body;
    const auth = (req as any).auth as Auth;

    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    // Validate order plate
    const orderPlate = await OrderPlates.findByPk(orderPlateId, {
      include: [
        {
          model: Order, as: 'order',
          include: [
            { model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } }
          ] 
        },
      ],
    });
    if (!orderPlate) {
      res.status(404).json(createErrorResponse('Order plate not found'));
      return;
    }

    // Get the order to access restaurantId
    const order = (orderPlate as any).order;
    if (!order) {
      res.status(404).json(createErrorResponse('Order not found for this plate'));
      return;
    }

    // Validate product
    const product = await Product.findOne({
      where: { id: productId, restaurantId: order.restaurantId },
      include: [{ model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } }],
    });
    if (!product) {
      res.status(404).json(createErrorResponse('Product not found'));
      return;
    }

    if (action !== 'add' && action !== 'remove') {
      res.status(400).json(createErrorResponse("Action must be either 'add' or 'remove'"));
      return;
    }

    // Add product to order plate within a transaction
    const result = await sequelize.transaction(async (t) => {
      const productPrice = Number(product.price);
      const orderTotalAmount = Number(order.totalAmount);
      const subtotal = Number((productPrice * quantity).toFixed(2));

      const orderPlateProduct = await OrderPlateProducts.create({
        orderPlateId: orderPlate.id,
        quantity,
        price: productPrice,
        subtotal,
        action,
        notes: notes || null,
      }, { transaction: t });

      // Update order total amount
      const amountChange = subtotal * (action === 'add' ? 1 : -1);
      order.totalAmount = Number((orderTotalAmount + amountChange).toFixed(2));
      await order.save({ transaction: t });

      return orderPlateProduct;
    });

    const newOrderPlateProduct = await OrderPlateProducts.findByPk(result.id, {
      include: [{ model: Product, as: 'product', attributes: { include: ['id', 'name'] } }],
    });

    res.status(201).json(createSuccessResponse(newOrderPlateProduct, 'Product added to order plate successfully'));
  } catch (error) {
    next(error);
  }
};

export const addDrinkToOrder = async (req : Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { drinkId, quantity, notes } = req.body;
    const auth = (req as any).auth as Auth;

    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    // Validate order
    const order = await Order.findOne({
      where: { id: orderId },
      include: [{ model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } }],
    });
    if (!order) {
      res.status(404).json(createErrorResponse('Order not found'));
      return;
    }

    // Validate drink
    const drink = await Drink.findOne({
      where: { id: drinkId, restaurantId: order.restaurantId },
      include: [{ model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } }],
    });
    if (!drink) {
      res.status(404).json(createErrorResponse('Drink not found'));
      return;
    }

    // Add drink to order within a transaction
    const result = await sequelize.transaction(async (t) => {
      const drinkPrice = Number(drink.price);
      const orderTotalAmount = Number(order.totalAmount);
      const subtotal = Number((drinkPrice * quantity).toFixed(2));

      const orderDrink = await OrderDrinks.create({
        orderId: order.id,
        drinkId: drink.id,
        quantity,
        unitPrice: drinkPrice,
        subtotal,
        notes: notes || null,
      }, { transaction: t });

      // Update order total amount
      order.totalAmount = Number((orderTotalAmount + subtotal).toFixed(2));
      await order.save({ transaction: t });

      return orderDrink;
    });
    
    const newOrderDrink = await OrderDrinks.findByPk(result.id, {
      include: [{ model: Drink, as: 'drink', attributes: { include: ['id', 'name'] } }],
    });

    res.status(201).json(createSuccessResponse(newOrderDrink, 'Drink added to order successfully'));
  } catch (error) {
    next(error);
  }
};
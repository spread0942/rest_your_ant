import { Request, Response, NextFunction } from 'express';
import { Auth, Plate, PlateProduct, Product, Restaurant } from '../models';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import sequelize from '../config/database';

export const createPlate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, price, category, isAvailable, restaurantId, productIds } = req.body;
    const auth: Auth = (req as any).auth as Auth;

    if (!auth || !auth?.tenantId) {
      res.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    // Verify that the restaurant belongs to the user's tenant
    const restaurant = await Restaurant.findOne({
      where: { id: restaurantId, tenantId: auth.tenantId }
    });
    if (!restaurant) {
      res.status(404).json(createErrorResponse('Restaurant not found'));
      return;
    }

    // validate productIds if provided
    if (productIds && Array.isArray(productIds) && productIds.length > 0) {
      const validProducts = await Product.findAll({
          where: { id: productIds, restaurantId }
        });
      if (validProducts.length !== productIds.length) {
        res.status(400).json(createErrorResponse('One or more product IDs are invalid'));
        return;
      }
    }

    // Create plate within a transaction
    const result = await sequelize.transaction(async (transaction) => {
      const plate = await Plate.create({
        name,
        description,
        price,
        category,
        isAvailable,
        restaurantId,
      },
      { transaction });

      if (productIds && Array.isArray(productIds) && productIds.length > 0) {
        const plateProducts = productIds.map((productId: number) => ({
          plateId: plate.id,
          productId,
        }));
        await PlateProduct.bulkCreate(plateProducts, { transaction });
      }

      return plate;
    });

    const plate = await Plate.findByPk(result.id, {
      include: [
        { model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } },
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name', 'description'],
          through: { attributes: [] } // Exclude junction table attributes
        },
      ],
    });

    res.status(201).json(createSuccessResponse(plate, 'Plate created successfully'));
  } catch (error) {
    next(error);
  }
};

export const getAllPlates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 10, category, isAvailable, restaurantId } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const auth: Auth = (req as any).auth as Auth;

    if (!auth || !auth?.tenantId) {
      res.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    // Build where clause based on query parameters
    let whereClause: any = {};

    if (category) whereClause.category = category;
    if (isAvailable !== undefined) whereClause.isAvailable = isAvailable === 'true';
    if (restaurantId) whereClause.restaurantId = Number(restaurantId);

    const { count, rows } = await Plate.findAndCountAll({
      where: whereClause,
      include: [
        { model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } },
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name', 'description'],
          through: { attributes: [] } // Exclude junction table attributes
        },
      ],
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json(createSuccessResponse({
      plates: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    }, 'Plates retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getPlateById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const auth: Auth = (req as any).auth as Auth;

    if (!auth || !auth?.tenantId) {
      res.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    const plate = await Plate.findOne({
      where: { id },
      include: [
        { model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } },
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name', 'description'],
          through: { attributes: [] } // Exclude junction table attributes
        },
      ]
    });

    if (!plate) {
      res.status(404).json(createErrorResponse('Plate not found'));
      return;
    }

    res.json(createSuccessResponse(plate, 'Plate retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updatePlate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price, category, isAvailable, restaurantId, productIds } = req.body;
    const auth: Auth = (req as any).auth as Auth;

    if (!auth || !auth?.tenantId) {
      res.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    // Verify that the plate belongs to the user's tenant via the restaurant
    const plate = await Plate.findOne({
      where: { id },
      include: [
        { model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } }
      ]
    });

    if (!plate) {
      res.status(404).json(createErrorResponse('Plate not found'));
      return;
    }

    // validate restaurantId if provided
    if (restaurantId) {
      const restaurant = await Restaurant.findOne({
        where: { id: restaurantId, tenantId: auth.tenantId }
      });
      if (!restaurant) {
        res.status(404).json(createErrorResponse('Restaurant not found'));
        return;
      }
    }

    // Validate products if provided
    if (productIds && Array.isArray(productIds) && productIds.length > 0) {
      const isValidStructure = productIds.every((productId: any) => 
        typeof productId === 'number'
      );

      if (!isValidStructure) {
        res.status(400).json(createErrorResponse('Invalid products structure. Expected array of {productId: number, quantity: number}'));
        return;
      }

      // Validate product IDs exist and belong to the same tenant
      const products = productIds.map((p: any) => p.productId);
      const validProducts = await Product.findAll({
        where: { id: products },
        include: [
          { model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } }
        ],
        attributes: ['id']
      });

      if (validProducts.length !== productIds.length) {
        res.status(400).json(createErrorResponse('One or more product IDs are invalid or do not belong to your tenant'));
        return;
      }
    }

    // Use transaction for atomic operation
    const result = await sequelize.transaction(async (transaction) => {
      await plate.update({
        name,
        description,
        price,
        category,
        isAvailable,
        restaurantId,
      }, { transaction });

      if (productIds !== undefined) {
        // Update product associations
        await PlateProduct.destroy({
          where: { plateId: id },
          transaction
        });

        if (Array.isArray(productIds) && productIds.length > 0) {
          const plateProducts = productIds.map((productId: number) => ({
            plateId: parseInt(id),
            productId,
          }));
          
          await PlateProduct.bulkCreate(plateProducts, { transaction });
        }
      }

      return plate;
    });

    const updatedPlate = await Plate.findByPk(result.id, {
      include: [
        { model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } },
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name', 'description'],
          through: { attributes: [] } // Exclude junction table attributes
        },
      ],
    });

    res.json(createSuccessResponse(updatedPlate, 'Plate updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deletePlate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const auth: Auth = (req as any).auth as Auth;

    if (!auth || !auth?.tenantId) {
      res.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    // Verify that the plate belongs to the user's tenant via the menu and restaurant
    const plate = await Plate.findOne({
      where: { id },
      include: [
        { model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } }
      ]
    });

    if (!plate) {
      res.status(404).json(createErrorResponse('Plate not found'));
      return;
    }

    await plate.destroy();
    res.json(createSuccessResponse(null, 'Plate deleted successfully'));
  } catch (error) {
    next(error);
  }
};

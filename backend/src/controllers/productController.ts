import { Request, Response, NextFunction } from 'express';
import { Auth, Product, Restaurant } from '../models';
import { createSuccessResponse, createErrorResponse } from '../utils/response';

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, unit, price, stock, minStock, restaurantId } = req.body;
    const auth = (req as any).auth as Auth;

    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    // Verify that the restaurant belongs to the user's tenant
    const restaurant = await Restaurant.findOne({
      where: { 
        id: restaurantId,
        tenantId: auth.tenantId 
      }
    });

    if (!restaurant) {
      res.status(400).json(createErrorResponse('Invalid restaurant or restaurant does not belong to your tenant'));
      return;
    }

    const product = await Product.create({
      name,
      description,
      unit,
      price,
      stock,
      minStock,
      restaurantId,
    });

    res.status(201).json(createSuccessResponse(product, 'Product created successfully'));
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 10, lowStock, restaurantId } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const auth = (req as any).auth as Auth;

    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    let whereClause: any = {};
    if (lowStock === 'true') {
      whereClause = {
        stock: {
          [require('sequelize').Op.lte]: require('sequelize').col('minStock')
        }
      };
    }
    if (restaurantId) whereClause.restaurantId = restaurantId;

    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Restaurant,
          as: 'restaurant',
          where: {
            tenantId: auth.tenantId
          },
          attributes: ['id', 'name', 'address', 'phone', 'tenantId']
        }
      ],
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json(createSuccessResponse({
      products: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    }, 'Products retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const auth = (req as any).auth as Auth;

    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    const product = await Product.findOne({
      where: { id },
      include: [
        {
          model: Restaurant,
          as: 'restaurant',
          where: {
            tenantId: auth.tenantId
          },
          attributes: ['id', 'name', 'address', 'phone', 'tenantId']
        }
      ]
    });

    if (!product) {
      res.status(404).json(createErrorResponse('Product not found'));
      return;
    }

    res.json(createSuccessResponse(product, 'Product retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, unit, price, stock, minStock, restaurantId } = req.body;
    const auth = (req as any).auth as Auth;

    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    // Verify that the restaurant belongs to the user's tenant
    const restaurant = await Restaurant.findOne({
      where: { 
        id: restaurantId,
        tenantId: auth.tenantId 
      }
    });

    if (!restaurant) {
      res.status(400).json(createErrorResponse('Invalid restaurant or restaurant does not belong to your tenant'));
      return;
    }

    const product = await Product.findOne({
      where: { id },
      include: [
        {
          model: Restaurant,
          as: 'restaurant',
          where: {
            tenantId: auth.tenantId
          },
          attributes: ['id', 'name', 'address', 'phone', 'tenantId']
        }
      ]
    });

    if (!product) {
      res.status(404).json(createErrorResponse('Product not found'));
      return;
    }

    await product.update({
      name,
      description,
      unit,
      price,
      stock,
      minStock,
      restaurantId,
    });

    res.json(createSuccessResponse(product, 'Product updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const auth = (req as any).auth as Auth;

    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    const product = await Product.findOne({
      where: { id },
      include: [
        {
          model: Restaurant,
          as: 'restaurant',
          where: {
            tenantId: auth.tenantId
          },
          attributes: ['id', 'name', 'address', 'phone', 'tenantId']
        }
      ]
    });

    if (!product) {
      res.status(404).json(createErrorResponse('Product not found'));
      return;
    }

    await product.destroy();
    res.json(createSuccessResponse(null, 'Product deleted successfully'));
  } catch (error) {
    next(error);
  }
};

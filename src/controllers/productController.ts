import { Request, Response, NextFunction } from 'express';
import { Product } from '../models';
import { createSuccessResponse, createErrorResponse } from '../utils/response';

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, unit, price, stock, minStock } = req.body;

    const product = await Product.create({
      name,
      description,
      unit,
      price,
      stock,
      minStock,
    });

    res.status(201).json(createSuccessResponse(product, 'Product created successfully'));
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 10, lowStock } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause: any = {};
    if (lowStock === 'true') {
      whereClause = {
        stock: {
          [require('sequelize').Op.lte]: require('sequelize').col('minStock')
        }
      };
    }

    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
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

    const product = await Product.findByPk(id);

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
    const { name, description, unit, price, stock, minStock } = req.body;

    const product = await Product.findByPk(id);
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
    });

    res.json(createSuccessResponse(product, 'Product updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
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

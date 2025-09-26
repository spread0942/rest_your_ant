import { Request, Response, NextFunction } from 'express';
import { Table, Restaurant } from '../models';
import { createSuccessResponse, createErrorResponse } from '../utils/response';

export const createTable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { restaurantId, number, capacity, status } = req.body;

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      res.status(404).json(createErrorResponse('Restaurant not found'));
      return;
    }

    const table = await Table.create({
      restaurantId,
      number,
      capacity,
      status,
    });

    res.status(201).json(createSuccessResponse(table, 'Table created successfully'));
  } catch (error) {
    next(error);
  }
};

export const getAllTables = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 10, restaurantId, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (restaurantId) whereClause.restaurantId = Number(restaurantId);
    if (status) whereClause.status = status;

    const { count, rows } = await Table.findAndCountAll({
      where: whereClause,
      include: [{ model: Restaurant, as: 'restaurant' }],
      limit: Number(limit),
      offset,
      order: [['restaurantId', 'ASC'], ['number', 'ASC']],
    });

    res.json(createSuccessResponse({
      tables: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    }, 'Tables retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getTableById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const table = await Table.findByPk(id, {
      include: [{ model: Restaurant, as: 'restaurant' }],
    });

    if (!table) {
      res.status(404).json(createErrorResponse('Table not found'));
      return;
    }

    res.json(createSuccessResponse(table, 'Table retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateTable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { restaurantId, number, capacity, status } = req.body;

    const table = await Table.findByPk(id);
    if (!table) {
      res.status(404).json(createErrorResponse('Table not found'));
      return;
    }

    if (restaurantId) {
      const restaurant = await Restaurant.findByPk(restaurantId);
      if (!restaurant) {
        res.status(404).json(createErrorResponse('Restaurant not found'));
        return;
      }
    }

    await table.update({
      restaurantId: restaurantId || table.restaurantId,
      number,
      capacity,
      status,
    });

    res.json(createSuccessResponse(table, 'Table updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteTable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const table = await Table.findByPk(id);
    if (!table) {
      res.status(404).json(createErrorResponse('Table not found'));
      return;
    }

    await table.destroy();
    res.json(createSuccessResponse(null, 'Table deleted successfully'));
  } catch (error) {
    next(error);
  }
};

import { Request, Response, NextFunction } from 'express';
import { Plate } from '../models';
import { createSuccessResponse, createErrorResponse } from '../utils/response';

export const createPlate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, price, category, isAvailable } = req.body;

    const plate = await Plate.create({
      name,
      description,
      price,
      category,
      isAvailable,
    });

    res.status(201).json(createSuccessResponse(plate, 'Plate created successfully'));
  } catch (error) {
    next(error);
  }
};

export const getAllPlates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 10, category, isAvailable } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (category) whereClause.category = category;
    if (isAvailable !== undefined) whereClause.isAvailable = isAvailable === 'true';

    const { count, rows } = await Plate.findAndCountAll({
      where: whereClause,
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

    const plate = await Plate.findByPk(id);

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
    const { name, description, price, category, isAvailable } = req.body;

    const plate = await Plate.findByPk(id);
    if (!plate) {
      res.status(404).json(createErrorResponse('Plate not found'));
      return;
    }

    await plate.update({
      name,
      description,
      price,
      category,
      isAvailable,
    });

    res.json(createSuccessResponse(plate, 'Plate updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deletePlate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const plate = await Plate.findByPk(id);
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

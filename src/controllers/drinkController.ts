import { Request, Response, NextFunction } from 'express';
import { Drink } from '../models';
import { createSuccessResponse, createErrorResponse } from '../utils/response';

export const createDrink = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, price, category, isAlcoholic, isAvailable } = req.body;

    const drink = await Drink.create({
      name,
      description,
      price,
      category,
      isAlcoholic,
      isAvailable,
    });

    res.status(201).json(createSuccessResponse(drink, 'Drink created successfully'));
  } catch (error) {
    next(error);
  }
};

export const getAllDrinks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 10, category, isAlcoholic, isAvailable } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (category) whereClause.category = category;
    if (isAlcoholic !== undefined) whereClause.isAlcoholic = isAlcoholic === 'true';
    if (isAvailable !== undefined) whereClause.isAvailable = isAvailable === 'true';

    const { count, rows } = await Drink.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json(createSuccessResponse({
      drinks: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    }, 'Drinks retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getDrinkById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const drink = await Drink.findByPk(id);

    if (!drink) {
      res.status(404).json(createErrorResponse('Drink not found'));
      return;
    }

    res.json(createSuccessResponse(drink, 'Drink retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateDrink = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price, category, isAlcoholic, isAvailable } = req.body;

    const drink = await Drink.findByPk(id);
    if (!drink) {
      res.status(404).json(createErrorResponse('Drink not found'));
      return;
    }

    await drink.update({
      name,
      description,
      price,
      category,
      isAlcoholic,
      isAvailable,
    });

    res.json(createSuccessResponse(drink, 'Drink updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteDrink = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const drink = await Drink.findByPk(id);
    if (!drink) {
      res.status(404).json(createErrorResponse('Drink not found'));
      return;
    }

    await drink.destroy();
    res.json(createSuccessResponse(null, 'Drink deleted successfully'));
  } catch (error) {
    next(error);
  }
};

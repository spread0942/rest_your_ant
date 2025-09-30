import { Request, Response, NextFunction } from 'express';
import { Auth, Drink, Restaurant } from '../models';
import { createSuccessResponse, createErrorResponse } from '../utils/response';

export const createDrink = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, price, category, isAlcoholic, isAvailable, restaurantId } = req.body;
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

    const drink = await Drink.create({
      name,
      description,
      price,
      category,
      isAlcoholic,
      isAvailable,
      restaurantId,
    });

    res.status(201).json(createSuccessResponse(drink, 'Drink created successfully'));
  } catch (error) {
    next(error);
  }
};

export const getAllDrinks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 10, category, isAlcoholic, isAvailable, restaurantId } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const auth = (req as any).auth as Auth;

    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    const whereClause: any = {};
    if (category) whereClause.category = category;
    if (isAlcoholic !== undefined) whereClause.isAlcoholic = isAlcoholic === 'true';
    if (isAvailable !== undefined) whereClause.isAvailable = isAvailable === 'true';
    if (restaurantId) whereClause.restaurantId = restaurantId;

    const { count, rows } = await Drink.findAndCountAll({
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
    const auth = (req as any).auth as Auth;

    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    const drink = await Drink.findOne({
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
    const { name, description, price, category, isAlcoholic, isAvailable, restaurantId } = req.body;
    const auth = (req as any).auth as Auth;

    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    // Verify that the restaurant belongs to the user's tenant
    if (restaurantId) {
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
    }

    const drink = await Drink.findOne({
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
      restaurantId,
    });

    res.json(createSuccessResponse(drink, 'Drink updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteDrink = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const auth = (req as any).auth as Auth;

    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    const drink = await Drink.findOne({
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

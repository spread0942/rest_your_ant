import { Request, Response, NextFunction } from 'express';
import { Restaurant, Auth } from '../models';
import { createSuccessResponse, createErrorResponse } from '../utils/response';

export const createRestaurant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, address, phone, email, website } = req.body;
    const auth = (req as any).user as Auth;

    if (!auth?.tenants || auth.tenants.length === 0) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    const restaurant = await Restaurant.create({
      name,
      description,
      address,
      phone,
      email,
      website,
      tenantId: auth.tenants[0].id, // assuming the user is associated with at least one tenant
    });

    res.status(201).json(createSuccessResponse(restaurant, 'Restaurant created successfully'));
  } catch (error) {
    next(error);
  }
};

export const getAllRestaurants = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // can you update this method to filter by accountId and paginate the results?
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const auth = (req as any).user as Auth;

    if (!auth?.tenants || auth.tenants.length === 0) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    const { count, rows } = await Restaurant.findAndCountAll({
      where: { tenantId: auth.tenants[0].id },
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json(createSuccessResponse({
      restaurants: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    }, 'Restaurants retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getRestaurantById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const auth = (req as any).user as Auth;

    if (!auth?.tenants || auth.tenants.length === 0) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    const restaurant = await Restaurant.findOne({
      where: { id, tenantId: auth.tenants[0].id },
    });

    if (!restaurant) {
      res.status(404).json(createErrorResponse('Restaurant not found'));
      return;
    }

    res.json(createSuccessResponse(restaurant, 'Restaurant retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateRestaurant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, address, phone, email, website } = req.body;
    const auth = (req as any).user as Auth;

    if (!auth?.tenants || auth.tenants.length === 0) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    const restaurant = await Restaurant.findOne({
      where: { id, tenantId: auth.tenants[0].id },
    });
    if (!restaurant) {
      res.status(404).json(createErrorResponse('Restaurant not found'));
      return;
    }

    await restaurant.update({
      name,
      description,
      address,
      phone,
      email,
      website,
    });

    res.json(createSuccessResponse(restaurant, 'Restaurant updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteRestaurant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const auth = (req as any).user as Auth;

    if (!auth?.tenants || auth.tenants.length === 0) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    const restaurant = await Restaurant.findOne({
      where: { id, tenantId: auth.tenants[0].id },
    });
    if (!restaurant) {
      res.status(404).json(createErrorResponse('Restaurant not found'));
      return;
    }

    await restaurant.destroy();
    res.json(createSuccessResponse(null, 'Restaurant deleted successfully'));
  } catch (error) {
    next(error);
  }
};

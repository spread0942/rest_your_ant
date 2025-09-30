import { Request, Response, NextFunction } from 'express';
import { Menu, Restaurant, Plate, Drink, Auth } from '../models';
import { createSuccessResponse, createErrorResponse } from '../utils/response';

export const createMenu = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { restaurantId, name, description, category, isActive } = req.body;
    const auth = (req as any).auth as Auth;

    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
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

    const menu = await Menu.create({
      restaurantId,
      name,
      description,
      category,
      isActive,
    });

    res.status(201).json(createSuccessResponse(menu, 'Menu created successfully'));
  } catch (error) {
    next(error);
  }
};

export const getAllMenus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 10, restaurantId } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const auth = (req as any).auth as Auth;

    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    const whereClause = restaurantId ? { restaurantId: Number(restaurantId), tenantId: auth.tenantId } : {};

    const { count, rows } = await Menu.findAndCountAll({
      where: whereClause,
      include: [{ model: Restaurant, as: 'restaurant' }],
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json(createSuccessResponse({
      menus: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    }, 'Menus retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getMenuById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const auth = (req as any).auth as Auth;

    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    const menu = await Menu.findByPk(id, {
      include: [
        { model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } },
        { model: Plate, as: 'plates' },
        { model: Drink, as: 'drinks' }
      ],
    });

    if (!menu) {
      res.status(404).json(createErrorResponse('Menu not found'));
      return;
    }

    res.json(createSuccessResponse(menu, 'Menu retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateMenu = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { restaurantId, name, description, isActive } = req.body;
    const auth = (req as any).auth as Auth;
    
    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    const menu = await Menu.findOne({
      where: { id },
      include: [{ model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } }]
    });

    if (!menu) {
      res.status(404).json(createErrorResponse('Menu not found'));
      return;
    }

    if (restaurantId) {
      const restaurant = await Restaurant.findByPk(restaurantId);
      if (!restaurant) {
        res.status(404).json(createErrorResponse('Restaurant not found'));
        return;
      }
    }

    await menu.update({
      restaurantId: restaurantId || menu.restaurantId,
      name,
      description,
      isActive,
    });

    res.json(createSuccessResponse(menu, 'Menu updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteMenu = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const auth = (req as any).auth as Auth;

    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    const menu = await Menu.findOne({
      where: { id },
      include: [{ model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } }]
    });

    if (!menu) {
      res.status(404).json(createErrorResponse('Menu not found'));
      return;
    }

    await menu.destroy();
    res.json(createSuccessResponse(null, 'Menu deleted successfully'));
  } catch (error) {
    next(error);
  }
};

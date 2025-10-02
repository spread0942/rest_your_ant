import { Request, Response, NextFunction } from 'express';
import { Menu, Restaurant, Plate, Drink, Auth, MenuPlate } from '../models';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import sequelize from '../config/database';

export const createMenu = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { restaurantId, name, description, category, isActive, plateIds } = req.body;
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

    // validate plateIds if provided
    if (plateIds && Array.isArray(plateIds) && plateIds.length > 0) {
      const validPlates = await Plate.findAll({
        where: { id: plateIds, restaurantId }
      });
      if (validPlates.length !== plateIds.length) {
        res.status(400).json(createErrorResponse('One or more plates not found in the specified restaurant'));
        return;
      }
    }

    const result = await sequelize.transaction(async (t) => {
      const menu = await Menu.create({
        restaurantId,
        name,
        description,
        category,
        isActive,
      }, { transaction: t });

      if (plateIds && Array.isArray(plateIds) && plateIds.length > 0) {
        const menuPlates = plateIds.map((plateId: number) => ({
          menuId: menu.id,
          plateId,
        }));
        await MenuPlate.bulkCreate(menuPlates, { transaction: t });
      }
      return menu;
    });

    const menu = await Menu.findByPk(result.id, {
      include: [
        { model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } },
        { 
          model: Plate, 
          as: 'plates',
          attributes: ['id', 'name', 'description', 'price'],
          through: { attributes: [] } // Exclude junction table attributes
        },
      ],
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
      res.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    // Build where clause based on query parameters
    const whereClause = restaurantId ? { restaurantId: Number(restaurantId), tenantId: auth.tenantId } : {};

    const { count, rows } = await Menu.findAndCountAll({
      where: whereClause,
      include: [
        { model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } },
        { 
          model: Plate, 
          as: 'plates',
          attributes: ['id', 'name', 'description', 'price'],
          through: { attributes: [] } // Exclude junction table attributes
        },
      ],
      offset,
      limit: Number(limit),
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
        { 
          model: Plate, 
          as: 'plates',
          attributes: ['id', 'name', 'description', 'price'],
          through: { attributes: [] } // Exclude junction table attributes
        },
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
    const { restaurantId, name, description, isActive, plateIds } = req.body;
    const auth = (req as any).auth as Auth;
    
    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('User tenant ID is required'));
      return;
    }

    // Verify that the menu belongs to the user's tenant via the restaurant
    const menu = await Menu.findOne({
      where: { id },
      include: [{ model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } }]
    });

    if (!menu) {
      res.status(404).json(createErrorResponse('Menu not found'));
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

    // validate plateIds if provided
    if (plateIds && Array.isArray(plateIds) && plateIds.length > 0) {
      const validPlates = await Plate.findAll({
        where: { id: plateIds, restaurantId: restaurantId || menu.restaurantId }
      });
      if (validPlates.length !== plateIds.length) {
        res.status(400).json(createErrorResponse('One or more plates not found in the specified restaurant'));
        return;
      }
    }

    const result = await sequelize.transaction(async (transaction) => {
      await menu.update({
        restaurantId: restaurantId || menu.restaurantId,
        name,
        description,
        isActive,
      }, { transaction });

      if (plateIds) {
        // Update plate associations
        await MenuPlate.destroy({ where: { menuId: id }, transaction });
        if (Array.isArray(plateIds) && plateIds.length > 0) {
          const menuPlates = plateIds.map((plateId: number) => ({
            menuId: parseInt(id),
            plateId,
          }));
          await MenuPlate.bulkCreate(menuPlates, { transaction });
        }
      }

      // Update menu details
      return menu;
    });

    const updatedMenu = await Menu.findByPk(result.id, {
      include: [
        { model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } },
        { 
          model: Plate, 
          as: 'plates',
          attributes: ['id', 'name', 'description', 'price'],
          through: { attributes: [] } // Exclude junction table attributes
        },
      ],
    });

    res.json(createSuccessResponse(updatedMenu, 'Menu updated successfully'));
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
      include: [
        { model: Restaurant, as: 'restaurant', where: { tenantId: auth.tenantId } }
      ]
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

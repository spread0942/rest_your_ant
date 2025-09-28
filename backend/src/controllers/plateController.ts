import { Request, Response, NextFunction } from 'express';
import { Auth, Menu, Plate, Restaurant } from '../models';
import { createSuccessResponse, createErrorResponse } from '../utils/response';

export const createPlate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, price, category, isAvailable, menuId } = req.body;
    const auth: Auth = (req as any).auth as Auth;

    if (!auth || !auth?.tenantId) {
      res.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    // Verify that the menu belongs to the user's tenant
    const menu = await Menu.findOne({
      where: { 
        id: menuId,
      },
      include: [{
        model: Restaurant,
        as: 'restaurant',
        where: { tenantId: auth.tenantId }
      }]
    });

    if (!menu) {
      res.status(404).json(createErrorResponse('Menu not found'));
      return;
    }

    const plate = await Plate.create({
      name,
      description,
      price,
      category,
      isAvailable,
      menuId,
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
    const auth: Auth = (req as any).auth as Auth;

    if (!auth || !auth?.tenantId) {
      res.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    // Build where clause based on query parameters
    let whereClause: any = {};

    if (category) whereClause.category = category;
    if (isAvailable !== undefined) whereClause.isAvailable = isAvailable === 'true';

    const { count, rows } = await Plate.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Menu,
          as: 'menu',
          include: [{
            model: Restaurant,
            as: 'restaurant',
            where: { tenantId: auth.tenantId }
          }]
        }
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
      include: [{
        model: Menu,
        as: 'menu',
        include: [{
          model: Restaurant,
          as: 'restaurant',
          where: { tenantId: auth.tenantId }
        }]
      }]
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
    const { name, description, price, category, isAvailable } = req.body;
    const auth: Auth = (req as any).auth as Auth;

    if (!auth || !auth?.tenantId) {
      res.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    const plate = await Plate.findOne({
      where: { id },
      include: [{
        model: Menu,
        as: 'menu',
        include: [{
          model: Restaurant,
          as: 'restaurant',
          where: { tenantId: auth.tenantId }
        }]
      }]
    });

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
    const auth: Auth = (req as any).auth as Auth;

    if (!auth || !auth?.tenantId) {
      res.status(401).json(createErrorResponse('Unauthorized'));
      return;
    }

    // Verify that the plate belongs to the user's tenant via the menu and restaurant
    const plate = await Plate.findOne({
      where: { id },
      include: [{
        model: Menu,
        as: 'menu',
        include: [{
          model: Restaurant,
          as: 'restaurant',
          where: { tenantId: auth.tenantId }
        }]
      }]
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

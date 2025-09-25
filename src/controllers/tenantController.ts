import { Request, Response, NextFunction } from 'express';
import { Auth, Tenant } from '../models';
import { createSuccessResponse, createErrorResponse } from '../utils/response';

export const createTenant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, domain } = req.body;
    const existingTenant = await Tenant.findOne({ where: { name } });
    // TODO: const existingTenant = await Tenant.findOne({ where: { domain } });
    if (existingTenant) {
      res.status(400).json(createErrorResponse('Tenant with this name already exists'));
      return;
    }

    const tenant = await Tenant.create({ name, domain });
    res.status(201).json(createSuccessResponse(tenant, 'Tenant created successfully'));
  } catch (error) {
    next(error);
  }
};

export const getTenants = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const auth = (req as any).user as Auth;
    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('Tenants ID is required'));
      return;
    }

    const tenants = await Tenant.findAll({
      where: { id: auth.tenantId },
    });
    res.json(createSuccessResponse(tenants, 'Tenants retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getTenantById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const auth = (req as any).user as Auth;
    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('Tenants ID is required'));
      return;
    }

    if (auth.tenantId !== parseInt(id, 10)) {
      res.status(403).json(createErrorResponse('Access to this tenant is forbidden'));
      return;
    }

    const tenant = await Tenant.findByPk(id);
    if (!tenant) {
      res.status(404).json(createErrorResponse('Tenant not found'));
      return;
    }

    res.json(createSuccessResponse(tenant, 'Tenant retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateTenant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, domain } = req.body;
    const auth = (req as any).user as Auth;
    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('Tenants ID is required'));
      return;
    }

    if (auth.tenantId !== parseInt(id, 10)) {
      res.status(403).json(createErrorResponse('Access to this tenant is forbidden'));
      return;
    }

    const tenant = await Tenant.findByPk(id);
    if (!tenant) {
      res.status(404).json(createErrorResponse('Tenant not found'));
      return;
    }

    tenant.name = name || tenant.name;
    tenant.domain = domain || tenant.domain;
    await tenant.save();

    res.json(createSuccessResponse(tenant, 'Tenant updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteTenant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const auth = (req as any).user as Auth;
    if (!auth?.tenantId) {
      res.status(400).json(createErrorResponse('Tenants ID is required'));
      return;
    }

    if (auth.tenantId !== parseInt(id, 10)) {
      res.status(403).json(createErrorResponse('Access to this tenant is forbidden'));
      return;
    }

    const tenant = await Tenant.findByPk(id);
    if (!tenant) {
      res.status(404).json(createErrorResponse('Tenant not found'));
      return;
    }

    await tenant.destroy();
    res.json(createSuccessResponse(null, 'Tenant deleted successfully'));
  } catch (error) {
    next(error);
  }
};
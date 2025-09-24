import { Request, Response, NextFunction } from 'express';
import { User } from '../models';
import { createSuccessResponse, createErrorResponse } from '../utils/response';

interface CreateUserRequest {
  accountId: User['accountId'];
  tenantId: User['tenantId'];
  role: User['role'];
};

export const createUser = async (req: Request<{}, {}, CreateUserRequest>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { accountId, tenantId, role } = req.body;
    const existingUser = await User.findOne({ where: { accountId, tenantId } });
    if (existingUser) {
      res.status(400).json(createErrorResponse('User for this account and tenant already exists'));
      return;
    };
    const user = await User.create({ accountId, tenantId, role });
    res.status(201).json(createSuccessResponse(user, 'User created successfully'));
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.findAll();
    res.json(createSuccessResponse(users, 'Users retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { accountId, tenantId } = req.params;
    const user = await User.findOne({ 
      where: { 
        accountId: parseInt(accountId, 10), 
        tenantId: parseInt(tenantId, 10) 
      } 
    });
    if (!user) {
      res.status(404).json(createErrorResponse('User not found'));
      return;
    }
    res.json(createSuccessResponse(user, 'User retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { accountId, tenantId } = req.params;
    const { role } = req.body;
    const user = await User.findOne({ 
      where: { 
        accountId: parseInt(accountId, 10), 
        tenantId: parseInt(tenantId, 10) 
      } 
    });
    if (!user) {
      res.status(404).json(createErrorResponse('User not found'));
      return;
    }
    user.role = role || user.role;
    await user.save();
    res.json(createSuccessResponse(user, 'User updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { accountId, tenantId } = req.params;
    const user = await User.findOne({ 
      where: { 
        accountId: parseInt(accountId, 10), 
        tenantId: parseInt(tenantId, 10) 
      } 
    });
    if (!user) {
      res.status(404).json(createErrorResponse('User not found'));
      return;
    }
    await user.destroy();
    res.json(createSuccessResponse(null, 'User deleted successfully'));
  } catch (error) {
    next(error);
  }
};
import { Request, Response, NextFunction } from 'express';
import { createErrorResponse } from '../utils/response';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map((error: any) => ({
      field: error.path,
      message: error.message,
    }));
    res.status(400).json(createErrorResponse('Validation failed', errors));
    return;
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'field';
    res.status(409).json(createErrorResponse(`${field} already exists`));
    return;
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    res.status(400).json(createErrorResponse('Invalid reference to related resource'));
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json(createErrorResponse('Invalid token'));
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json(createErrorResponse('Token expired'));
    return;
  }

  // Default error
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(status).json(createErrorResponse(message));
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json(createErrorResponse(`Route ${req.originalUrl} not found`));
};

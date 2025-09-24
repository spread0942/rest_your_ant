import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { createErrorResponse } from '../utils/response';
import { Account } from '../models';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json(createErrorResponse('Access token required'));
      return;
    }

    const token: string = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    const user = await Account.findByPk(decoded.id);
    if (!user) {
      res.status(401).json(createErrorResponse('Invalid token'));
      return;
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json(createErrorResponse('Invalid token'));
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json(createErrorResponse('Authentication required'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json(createErrorResponse('Insufficient permissions'));
      return;
    }

    next();
  };
};

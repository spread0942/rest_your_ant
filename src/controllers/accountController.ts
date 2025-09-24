import { Request, Response, NextFunction } from 'express';
import { Account, Auth, User } from '../models';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

export const createAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    const hashedPassword = await hashPassword(password);

    const account = await Account.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const { password: _, ...accountData } = account.toJSON();
    res.status(201).json(createSuccessResponse(accountData, 'Account created successfully'));
  } catch (error) {
    next(error);
  }
};

export const getAllAccounts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await Account.findAndCountAll({
      attributes: { exclude: ['password'] },
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    const accounts = rows.map(account => account.toJSON());
    
    res.json(createSuccessResponse({
      accounts,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    }, 'Accounts retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getAccountById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const account = await Account.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!account) {
      res.status(404).json(createErrorResponse('Account not found'));
      return;
    }

    res.json(createSuccessResponse(account, 'Account retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, email, firstName, lastName, password } = req.body;

    const account = await Account.findByPk(id);
    if (!account) {
      res.status(404).json(createErrorResponse('Account not found'));
      return;
    }

    const updateData: any = {
      username,
      email,
      firstName,
      lastName,
    };

    if (password) {
      updateData.password = await hashPassword(password);
    }

    await account.update(updateData);

    const { password: _, ...accountData } = account.toJSON();
    res.json(createSuccessResponse(accountData, 'Account updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const account = await Account.findByPk(id);
    if (!account) {
      res.status(404).json(createErrorResponse('Account not found'));
      return;
    }

    await account.destroy();
    res.json(createSuccessResponse(null, 'Account deleted successfully'));
  } catch (error) {
    next(error);
  }
};

interface LoginRequestBody {
  email: string;
  password: string;
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body as LoginRequestBody;

    // validate account
    const account: Account | null = await Account.findOne({ where: { email } });
    if (!account) {
      res.status(401).json(createErrorResponse('Invalid credentials'));
      return;
    }

    const isPasswordValid = await comparePassword(password, account.password);
    if (!isPasswordValid) {
      res.status(401).json(createErrorResponse('Invalid credentials'));
      return;
    }

    // validate users and tenants
    const users: User[] = await User.findAll({ where: { accountId: account.id } });
    if (!users || users.length === 0) {
      res.status(401).json(createErrorResponse('User not found for this account'));
      return;
    }

    // generate token
    const auth = new Auth(account, users);
    const token = generateToken(auth.toJSON());
    const { password: _, ...accountData } = account.toJSON();

    res.json(createSuccessResponse({
      account: accountData,
      token,
    }, 'Login successful'));
  } catch (error) {
    next(error);
  }
};

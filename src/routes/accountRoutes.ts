import { Router } from 'express';
import {
  createAccount,
  getAllAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
  login,
} from '../controllers/accountController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/login', login);
router.post('/', createAccount);

// Protected routes
router.get('/', authenticate, authorize(['admin']), getAllAccounts);
router.get('/:id', authenticate, getAccountById);
router.patch('/:id', authenticate, updateAccount);
router.delete('/:id', authenticate, authorize(['admin']), deleteAccount);

export default router;

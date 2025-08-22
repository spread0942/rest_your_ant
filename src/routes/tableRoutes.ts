import { Router } from 'express';
import {
  createTable,
  getAllTables,
  getTableById,
  updateTable,
  deleteTable,
} from '../controllers/tableController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllTables);
router.get('/:id', getTableById);

// Protected routes (admin only)
router.post('/', authenticate, authorize(['admin']), createTable);
router.patch('/:id', authenticate, authorize(['admin']), updateTable);
router.delete('/:id', authenticate, authorize(['admin']), deleteTable);

export default router;

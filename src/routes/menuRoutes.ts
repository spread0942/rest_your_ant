import { Router } from 'express';
import {
  createMenu,
  getAllMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
} from '../controllers/menuController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllMenus);
router.get('/:id', getMenuById);

// Protected routes (admin only)
router.post('/', authenticate, authorize(['admin']), createMenu);
router.patch('/:id', authenticate, authorize(['admin']), updateMenu);
router.delete('/:id', authenticate, authorize(['admin']), deleteMenu);

export default router;

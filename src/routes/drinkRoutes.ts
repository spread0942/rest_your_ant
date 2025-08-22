import { Router } from 'express';
import {
  createDrink,
  getAllDrinks,
  getDrinkById,
  updateDrink,
  deleteDrink,
} from '../controllers/drinkController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllDrinks);
router.get('/:id', getDrinkById);

// Protected routes (admin only)
router.post('/', authenticate, authorize(['admin']), createDrink);
router.patch('/:id', authenticate, authorize(['admin']), updateDrink);
router.delete('/:id', authenticate, authorize(['admin']), deleteDrink);

export default router;

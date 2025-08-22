import { Router } from 'express';
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from '../controllers/restaurantController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);

// Protected routes (admin only)
router.post('/', authenticate, authorize(['admin']), createRestaurant);
router.patch('/:id', authenticate, authorize(['admin']), updateRestaurant);
router.delete('/:id', authenticate, authorize(['admin']), deleteRestaurant);

export default router;

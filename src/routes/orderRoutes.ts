import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Protected routes
router.post('/', authenticate, createOrder);
router.get('/', authenticate, getAllOrders);
router.get('/:id', authenticate, getOrderById);
router.patch('/:id', authenticate, updateOrder);
router.delete('/:id', authenticate, authorize(['admin']), deleteOrder);

export default router;

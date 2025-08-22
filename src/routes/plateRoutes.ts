import { Router } from 'express';
import {
  createPlate,
  getAllPlates,
  getPlateById,
  updatePlate,
  deletePlate,
} from '../controllers/plateController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllPlates);
router.get('/:id', getPlateById);

// Protected routes (admin only)
router.post('/', authenticate, authorize(['admin']), createPlate);
router.patch('/:id', authenticate, authorize(['admin']), updatePlate);
router.delete('/:id', authenticate, authorize(['admin']), deletePlate);

export default router;

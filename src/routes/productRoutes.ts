import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Protected routes (admin only for all product operations)
router.post('/', authenticate, authorize(['admin']), createProduct);
router.get('/', authenticate, authorize(['admin']), getAllProducts);
router.get('/:id', authenticate, authorize(['admin']), getProductById);
router.patch('/:id', authenticate, authorize(['admin']), updateProduct);
router.delete('/:id', authenticate, authorize(['admin']), deleteProduct);

export default router;

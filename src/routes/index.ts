import { Router } from 'express';
import accountRoutes from './accountRoutes';
import restaurantRoutes from './restaurantRoutes';
import menuRoutes from './menuRoutes';
import plateRoutes from './plateRoutes';
import productRoutes from './productRoutes';
import drinkRoutes from './drinkRoutes';
import tableRoutes from './tableRoutes';
import orderRoutes from './orderRoutes';

const router = Router();

// API route prefix: /api
router.use('/accounts', accountRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/menus', menuRoutes);
router.use('/plates', plateRoutes);
router.use('/products', productRoutes);
router.use('/drinks', drinkRoutes);
router.use('/tables', tableRoutes);
router.use('/orders', orderRoutes);

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags: [System]
 *     summary: Health check endpoint
 *     description: Returns the health status of the API.
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Restaurant API is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-10-05T14:48:00.000Z
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Restaurant API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;

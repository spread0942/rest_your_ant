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
 * info:
 *   title: Restaurant Management API
 *   version: 1.0.0
 *   description: A comprehensive REST API for restaurant management with TypeScript, Express.js, Sequelize ORM, and PostgreSQL
 *   contact:
 *     name: API Support
 *     email: support@restaurant-api.com
 *   license:
 *     name: MIT
 *     url: https://opensource.org/licenses/MIT
 * servers:
 *   - url: http://localhost:3000
 *     description: Development server
 * tags:
 *   - name: Accounts
 *     description: User account management and authentication
 *   - name: Restaurants
 *     description: Restaurant management operations
 *   - name: Menus
 *     description: Menu management operations
 *   - name: Plates
 *     description: Plate/dish management operations
 *   - name: Products
 *     description: Product management operations
 *   - name: Drinks
 *     description: Drink management operations
 *   - name: Tables
 *     description: Table management operations
 *   - name: Orders
 *     description: Order management operations
 *   - name: System
 *     description: System health and status endpoints
 * security:
 *   - bearerAuth: []
 */

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

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Enter JWT token obtained from login endpoint
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error message
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *         message:
 *           type: string
 *           example: Operation successful
 */

export default router;

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

/**
 * @openapi
 * /api/restaurants:
 *   get:
 *     tags: [Restaurants]
 *     summary: Get all restaurants
 *     description: Retrieves a list of all restaurants. Authentication required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search restaurants by name or location
 *     responses:
 *       200:
 *         description: List of restaurants retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Pizza Palace"
 *                       description:
 *                         type: string
 *                         example: "Authentic Italian pizza and pasta"
 *                       address:
 *                         type: string
 *                         example: "123 Main Street, Downtown"
 *                       phone:
 *                         type: string
 *                         example: "+1234567890"
 *                       email:
 *                         type: string
 *                         example: "info@pizzapalace.com"
 *                       website:
 *                         type: string
 *                         example: "https://pizzapalace.com"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-01-01T00:00:00.000Z
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     pages:
 *                       type: integer
 *                       example: 5
 *                 message:
 *                   type: string
 *                   example: Restaurants retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
// Protected routes (authentication required)
router.get('/', authenticate, getAllRestaurants);

/**
 * @openapi
 * /api/restaurants/{id}:
 *   get:
 *     tags: [Restaurants]
 *     summary: Get restaurant by ID
 *     description: Retrieves a specific restaurant by ID. Authentication required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Restaurant ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Restaurant retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Pizza Palace"
 *                     description:
 *                       type: string
 *                       example: "Authentic Italian pizza and pasta restaurant"
 *                     address:
 *                       type: string
 *                       example: "123 Main Street, Downtown"
 *                     phone:
 *                       type: string
 *                       example: "+1234567890"
 *                     email:
 *                       type: string
 *                       example: "info@pizzapalace.com"
 *                     website:
 *                       type: string
 *                       example: "https://pizzapalace.com"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T00:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T00:00:00.000Z
 *                 message:
 *                   type: string
 *                   example: Restaurant retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticate, getRestaurantById);

/**
 * @openapi
 * /api/restaurants:
 *   post:
 *     tags: [Restaurants]
 *     summary: Create new restaurant
 *     description: Creates a new restaurant. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - phone
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Pizza Palace"
 *               description:
 *                 type: string
 *                 example: "Authentic Italian pizza and pasta restaurant"
 *               address:
 *                 type: string
 *                 example: "123 Main Street, Downtown"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "info@pizzapalace.com"
 *               website:
 *                 type: string
 *                 example: "https://pizzapalace.com"
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Pizza Palace"
 *                     description:
 *                       type: string
 *                       example: "Authentic Italian pizza and pasta restaurant"
 *                     address:
 *                       type: string
 *                       example: "123 Main Street, Downtown"
 *                     phone:
 *                       type: string
 *                       example: "+1234567890"
 *                     email:
 *                       type: string
 *                       example: "info@pizzapalace.com"
 *                     website:
 *                       type: string
 *                       example: "https://pizzapalace.com"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T00:00:00.000Z
 *                 message:
 *                   type: string
 *                   example: Restaurant created successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       409:
 *         description: Conflict - Restaurant name or email already exists
 *       500:
 *         description: Internal server error
 */
// Protected routes (admin only)
router.post('/', authenticate, authorize(['admin']), createRestaurant);

/**
 * @openapi
 * /api/restaurants/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Update restaurant
 *     description: Updates a restaurant. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Restaurant ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Pizza Palace Updated"
 *               description:
 *                 type: string
 *                 example: "Updated description for the restaurant"
 *               address:
 *                 type: string
 *                 example: "456 New Street, Uptown"
 *               phone:
 *                 type: string
 *                 example: "+1987654321"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "updated@pizzapalace.com"
 *               website:
 *                 type: string
 *                 example: "https://new.pizzapalace.com"
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Pizza Palace Updated"
 *                     description:
 *                       type: string
 *                       example: "Updated description for the restaurant"
 *                     address:
 *                       type: string
 *                       example: "456 New Street, Uptown"
 *                     phone:
 *                       type: string
 *                       example: "+1987654321"
 *                     email:
 *                       type: string
 *                       example: "updated@pizzapalace.com"
 *                     website:
 *                       type: string
 *                       example: "https://new.pizzapalace.com"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T00:00:00.000Z
 *                 message:
 *                   type: string
 *                   example: Restaurant updated successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Restaurant not found
 *       409:
 *         description: Conflict - Restaurant name or email already exists
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', authenticate, authorize(['admin']), updateRestaurant);

/**
 * @openapi
 * /api/restaurants/{id}:
 *   delete:
 *     tags: [Restaurants]
 *     summary: Delete restaurant
 *     description: Deletes a restaurant. Admin access required. This will also remove all associated data (menus, plates, orders, etc.).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Restaurant ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
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
 *                   example: Restaurant and all associated data deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Restaurant not found
 *       409:
 *         description: Conflict - Cannot delete restaurant with active orders
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticate, authorize(['admin']), deleteRestaurant);

export default router;

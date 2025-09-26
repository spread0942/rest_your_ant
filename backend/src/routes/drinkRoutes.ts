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

/**
 * @openapi
 * /api/drinks:
 *   get:
 *     tags: [Drinks]
 *     summary: Get all drinks
 *     description: Retrieves a list of all drinks and beverages. Authentication required.
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
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by drink category
 *       - in: query
 *         name: isAlcoholic
 *         schema:
 *           type: boolean
 *         description: Filter alcoholic/non-alcoholic drinks
 *       - in: query
 *         name: restaurantId
 *         schema:
 *           type: integer
 *         description: Filter by restaurant ID
 *     responses:
 *       200:
 *         description: List of drinks retrieved successfully
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
 *                         example: "Coca Cola"
 *                       description:
 *                         type: string
 *                         example: "Classic carbonated soft drink"
 *                       price:
 *                         type: number
 *                         example: 2.50
 *                       category:
 *                         type: string
 *                         example: "Soft Drinks"
 *                       isAlcoholic:
 *                         type: boolean
 *                         example: false
 *                       volume:
 *                         type: string
 *                         example: "330ml"
 *                       isAvailable:
 *                         type: boolean
 *                         example: true
 *                       restaurantId:
 *                         type: integer
 *                         example: 1
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
 *                       example: 30
 *                     pages:
 *                       type: integer
 *                       example: 3
 *                 message:
 *                   type: string
 *                   example: Drinks retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
// Protected routes (authentication required)
router.get('/', authenticate, getAllDrinks);

/**
 * @openapi
 * /api/drinks/{id}:
 *   get:
 *     tags: [Drinks]
 *     summary: Get drink by ID
 *     description: Retrieves a specific drink by ID with detailed information. Authentication required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Drink ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Drink retrieved successfully
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
 *                       example: "Coca Cola"
 *                     description:
 *                       type: string
 *                       example: "Classic carbonated soft drink"
 *                     price:
 *                       type: number
 *                       example: 2.50
 *                     category:
 *                       type: string
 *                       example: "Soft Drinks"
 *                     isAlcoholic:
 *                       type: boolean
 *                       example: false
 *                     volume:
 *                       type: string
 *                       example: "330ml"
 *                     calories:
 *                       type: integer
 *                       example: 140
 *                     temperature:
 *                       type: string
 *                       example: "Cold"
 *                     isAvailable:
 *                       type: boolean
 *                       example: true
 *                     restaurantId:
 *                       type: integer
 *                       example: 1
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
 *                   example: Drink retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Drink not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticate, getDrinkById);

/**
 * @openapi
 * /api/drinks:
 *   post:
 *     tags: [Drinks]
 *     summary: Create new drink
 *     description: Creates a new drink/beverage. Admin access required.
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
 *               - price
 *               - restaurantId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Coca Cola"
 *               description:
 *                 type: string
 *                 example: "Classic carbonated soft drink"
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 2.50
 *               category:
 *                 type: string
 *                 example: "Soft Drinks"
 *               isAlcoholic:
 *                 type: boolean
 *                 default: false
 *                 example: false
 *               volume:
 *                 type: string
 *                 example: "330ml"
 *               calories:
 *                 type: integer
 *                 minimum: 0
 *                 example: 140
 *               temperature:
 *                 type: string
 *                 enum: ["Cold", "Hot", "Room Temperature"]
 *                 example: "Cold"
 *               isAvailable:
 *                 type: boolean
 *                 default: true
 *                 example: true
 *               restaurantId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Drink created successfully
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
 *                       example: "Coca Cola"
 *                     description:
 *                       type: string
 *                       example: "Classic carbonated soft drink"
 *                     price:
 *                       type: number
 *                       example: 2.50
 *                     category:
 *                       type: string
 *                       example: "Soft Drinks"
 *                     isAlcoholic:
 *                       type: boolean
 *                       example: false
 *                     isAvailable:
 *                       type: boolean
 *                       example: true
 *                     restaurantId:
 *                       type: integer
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T00:00:00.000Z
 *                 message:
 *                   type: string
 *                   example: Drink created successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Internal server error
 */
// Protected routes (admin only)
router.post('/', authenticate, authorize(['admin']), createDrink);

/**
 * @openapi
 * /api/drinks/{id}:
 *   patch:
 *     tags: [Drinks]
 *     summary: Update drink
 *     description: Updates a drink/beverage. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Drink ID
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
 *                 example: "Coca Cola Zero"
 *               description:
 *                 type: string
 *                 example: "Zero sugar cola drink"
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 2.75
 *               category:
 *                 type: string
 *                 example: "Diet Soft Drinks"
 *               isAlcoholic:
 *                 type: boolean
 *                 example: false
 *               volume:
 *                 type: string
 *                 example: "500ml"
 *               calories:
 *                 type: integer
 *                 minimum: 0
 *                 example: 0
 *               temperature:
 *                 type: string
 *                 enum: ["Cold", "Hot", "Room Temperature"]
 *                 example: "Cold"
 *               isAvailable:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Drink updated successfully
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
 *                       example: "Coca Cola Zero"
 *                     price:
 *                       type: number
 *                       example: 2.75
 *                     calories:
 *                       type: integer
 *                       example: 0
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T00:00:00.000Z
 *                 message:
 *                   type: string
 *                   example: Drink updated successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Drink not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', authenticate, authorize(['admin']), updateDrink);

/**
 * @openapi
 * /api/drinks/{id}:
 *   delete:
 *     tags: [Drinks]
 *     summary: Delete drink
 *     description: Deletes a drink/beverage. Admin access required. This will remove the drink from all menus and orders.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Drink ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Drink deleted successfully
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
 *                   example: Drink deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Drink not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticate, authorize(['admin']), deleteDrink);

export default router;

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

/**
 * @openapi
 * /api/plates:
 *   get:
 *     tags: [Plates]
 *     summary: Get all plates
 *     description: Retrieves a list of all plates/dishes. Authentication required.
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
 *         description: Filter by plate category
 *       - in: query
 *         name: restaurantId
 *         schema:
 *           type: integer
 *         description: Filter by restaurant ID
 *     responses:
 *       200:
 *         description: List of plates retrieved successfully
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
 *                         example: "Margherita Pizza"
 *                       description:
 *                         type: string
 *                         example: "Classic pizza with tomato and mozzarella"
 *                       price:
 *                         type: number
 *                         example: 12.99
 *                       category:
 *                         type: string
 *                         example: "Pizza"
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
 *                       example: 50
 *                     pages:
 *                       type: integer
 *                       example: 5
 *                 message:
 *                   type: string
 *                   example: Plates retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
// Protected routes (authentication required)
router.get('/', authenticate, getAllPlates);

/**
 * @openapi
 * /api/plates/{id}:
 *   get:
 *     tags: [Plates]
 *     summary: Get plate by ID
 *     description: Retrieves a specific plate by ID with ingredients and nutritional info. Authentication required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Plate ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Plate retrieved successfully
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
 *                       example: "Margherita Pizza"
 *                     description:
 *                       type: string
 *                       example: "Classic pizza with tomato and mozzarella"
 *                     price:
 *                       type: number
 *                       example: 12.99
 *                     category:
 *                       type: string
 *                       example: "Pizza"
 *                     preparationTime:
 *                       type: integer
 *                       example: 15
 *                     calories:
 *                       type: integer
 *                       example: 280
 *                     isVegetarian:
 *                       type: boolean
 *                       example: true
 *                     isVegan:
 *                       type: boolean
 *                       example: false
 *                     isGlutenFree:
 *                       type: boolean
 *                       example: false
 *                     isAvailable:
 *                       type: boolean
 *                       example: true
 *                     restaurantId:
 *                       type: integer
 *                       example: 1
 *                     products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Mozzarella Cheese"
 *                           quantity:
 *                             type: string
 *                             example: "100g"
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
 *                   example: Plate retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Plate not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticate, getPlateById);

/**
 * @openapi
 * /api/plates:
 *   post:
 *     tags: [Plates]
 *     summary: Create new plate
 *     description: Creates a new plate/dish. Admin access required.
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
 *                 example: "Margherita Pizza"
 *               description:
 *                 type: string
 *                 example: "Classic pizza with tomato and mozzarella"
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 12.99
 *               category:
 *                 type: string
 *                 example: "Pizza"
 *               preparationTime:
 *                 type: integer
 *                 minimum: 1
 *                 example: 15
 *               calories:
 *                 type: integer
 *                 minimum: 0
 *                 example: 280
 *               isVegetarian:
 *                 type: boolean
 *                 default: false
 *                 example: true
 *               isVegan:
 *                 type: boolean
 *                 default: false
 *                 example: false
 *               isGlutenFree:
 *                 type: boolean
 *                 default: false
 *                 example: false
 *               isAvailable:
 *                 type: boolean
 *                 default: true
 *                 example: true
 *               restaurantId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Plate created successfully
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
 *                       example: "Margherita Pizza"
 *                     description:
 *                       type: string
 *                       example: "Classic pizza with tomato and mozzarella"
 *                     price:
 *                       type: number
 *                       example: 12.99
 *                     category:
 *                       type: string
 *                       example: "Pizza"
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
 *                   example: Plate created successfully
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
router.post('/', authenticate, authorize(['admin']), createPlate);

/**
 * @openapi
 * /api/plates/{id}:
 *   patch:
 *     tags: [Plates]
 *     summary: Update plate
 *     description: Updates a plate/dish. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Plate ID
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
 *                 example: "Updated Margherita Pizza"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 14.99
 *               category:
 *                 type: string
 *                 example: "Gourmet Pizza"
 *               preparationTime:
 *                 type: integer
 *                 minimum: 1
 *                 example: 20
 *               calories:
 *                 type: integer
 *                 minimum: 0
 *                 example: 300
 *               isVegetarian:
 *                 type: boolean
 *                 example: true
 *               isVegan:
 *                 type: boolean
 *                 example: false
 *               isGlutenFree:
 *                 type: boolean
 *                 example: false
 *               isAvailable:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Plate updated successfully
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
 *                       example: "Updated Margherita Pizza"
 *                     price:
 *                       type: number
 *                       example: 14.99
 *                     isAvailable:
 *                       type: boolean
 *                       example: false
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T00:00:00.000Z
 *                 message:
 *                   type: string
 *                   example: Plate updated successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Plate not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', authenticate, authorize(['admin']), updatePlate);

/**
 * @openapi
 * /api/plates/{id}:
 *   delete:
 *     tags: [Plates]
 *     summary: Delete plate
 *     description: Deletes a plate/dish. Admin access required. This will remove the plate from all menus.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Plate ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Plate deleted successfully
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
 *                   example: Plate deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Plate not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticate, authorize(['admin']), deletePlate);

export default router;

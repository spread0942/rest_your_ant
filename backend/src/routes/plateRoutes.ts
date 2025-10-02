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
 * components:
 *   schemas:
 *     Plate:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Margherita Pizza"
 *         description:
 *           type: string
 *           example: "Classic pizza with tomato and mozzarella"
 *         price:
 *           type: number
 *           format: decimal
 *           example: 12.99
 *         category:
 *           type: string
 *           example: "Pizza"
 *         isAvailable:
 *           type: boolean
 *           example: true
 *         restaurantId:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T00:00:00.000Z
 *         restaurant:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             name:
 *               type: string
 *               example: "Restaurant Name"
 *             tenantId:
 *               type: integer
 *               example: 1
 *     PlateInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - restaurantId
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 100
 *           example: "Margherita Pizza"
 *         description:
 *           type: string
 *           example: "Classic pizza with tomato and mozzarella"
 *         price:
 *           type: number
 *           minimum: 0
 *           example: 12.99
 *         category:
 *           type: string
 *           maxLength: 50
 *           example: "Pizza"
 *         isAvailable:
 *           type: boolean
 *           default: true
 *           example: true
 *         restaurantId:
 *           type: integer
 *           example: 1
 *         productIds:
 *           type: array
 *           items:
 *             type: integer
 *           description: Array of product IDs to associate with this plate
 *           example: [1, 2, 3]
 */

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
 *         name: isAvailable
 *         schema:
 *           type: boolean
 *         description: Filter by availability status
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
 *                   type: object
 *                   properties:
 *                     plates:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Plate'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 50
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         totalPages:
 *                           type: integer
 *                           example: 5
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
 *                     isAvailable:
 *                       type: boolean
 *                       example: true
 *                     restaurantId:\n *                       type: integer\n *                       example: 1
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
 *             $ref: '#/components/schemas/PlateInput'
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
 *                   $ref: '#/components/schemas/Plate'
 *                 message:
 *                   type: string
 *                   example: Plate created successfully
 *       400:
 *         description: Bad request - Invalid input data or invalid productIds
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: One or more product IDs are invalid
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
 *                 maxLength: 100
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
 *                 maxLength: 50
 *                 example: "Gourmet Pizza"
 *               isAvailable:
 *                 type: boolean
 *                 example: false
 *               restaurantId:
 *                 type: integer
 *                 example: 1
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of product IDs to associate with this plate (replaces existing associations)
 *                 example: [1, 2, 3]
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
 *                   $ref: '#/components/schemas/Plate'
 *                 message:
 *                   type: string
 *                   example: Plate updated successfully
 *       400:
 *         description: Bad request - Invalid input data or invalid productIds
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: One or more product IDs are invalid or do not belong to your tenant
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

import { Router } from 'express';
import {
  createTable,
  getAllTables,
  getTableById,
  updateTable,
  deleteTable,
} from '../controllers/tableController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

/**
 * @openapi
 * /api/tables:
 *   get:
 *     tags: [Tables]
 *     summary: Get all tables
 *     description: Retrieves a list of all tables for reservation management. Authentication required.
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
 *         name: capacity
 *         schema:
 *           type: integer
 *         description: Filter by table capacity
 *       - in: query
 *         name: isAvailable
 *         schema:
 *           type: boolean
 *         description: Filter by availability status
 *       - in: query
 *         name: restaurantId
 *         schema:
 *           type: integer
 *         description: Filter by restaurant ID
 *     responses:
 *       200:
 *         description: List of tables retrieved successfully
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
 *                       number:
 *                         type: string
 *                         example: "T-001"
 *                       capacity:
 *                         type: integer
 *                         example: 4
 *                       location:
 *                         type: string
 *                         example: "Window side"
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
 *                       example: 20
 *                     pages:
 *                       type: integer
 *                       example: 2
 *                 message:
 *                   type: string
 *                   example: Tables retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
// Protected routes (authentication required)
router.get('/', authenticate, getAllTables);

/**
 * @openapi
 * /api/tables/{id}:
 *   get:
 *     tags: [Tables]
 *     summary: Get table by ID
 *     description: Retrieves a specific table by ID with detailed information. Authentication required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Table ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Table retrieved successfully
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
 *                     number:
 *                       type: string
 *                       example: "T-001"
 *                     capacity:
 *                       type: integer
 *                       example: 4
 *                     location:
 *                       type: string
 *                       example: "Window side, near entrance"
 *                     description:
 *                       type: string
 *                       example: "Cozy table with great view"
 *                     isAvailable:
 *                       type: boolean
 *                       example: true
 *                     restaurantId:
 *                       type: integer
 *                       example: 1
 *                     currentOrder:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 123
 *                         orderNumber:
 *                           type: string
 *                           example: "ORD-2023-001"
 *                         status:
 *                           type: string
 *                           example: "in_progress"
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
 *                   example: Table retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Table not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticate, getTableById);

/**
 * @openapi
 * /api/tables:
 *   post:
 *     tags: [Tables]
 *     summary: Create new table
 *     description: Creates a new table for the restaurant. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - capacity
 *               - restaurantId
 *             properties:
 *               number:
 *                 type: string
 *                 example: "T-001"
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 20
 *                 example: 4
 *               location:
 *                 type: string
 *                 example: "Window side"
 *               description:
 *                 type: string
 *                 example: "Cozy table with great view"
 *               isAvailable:
 *                 type: boolean
 *                 default: true
 *                 example: true
 *               restaurantId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Table created successfully
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
 *                     number:
 *                       type: string
 *                       example: "T-001"
 *                     capacity:
 *                       type: integer
 *                       example: 4
 *                     location:
 *                       type: string
 *                       example: "Window side"
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
 *                   example: Table created successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Restaurant not found
 *       409:
 *         description: Conflict - Table number already exists
 *       500:
 *         description: Internal server error
 */
// Protected routes (admin only)
router.post('/', authenticate, authorize(['admin']), createTable);

/**
 * @openapi
 * /api/tables/{id}:
 *   patch:
 *     tags: [Tables]
 *     summary: Update table
 *     description: Updates a table. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Table ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: string
 *                 example: "T-001-VIP"
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 20
 *                 example: 6
 *               location:
 *                 type: string
 *                 example: "VIP section, window side"
 *               description:
 *                 type: string
 *                 example: "Premium table with excellent view"
 *               isAvailable:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Table updated successfully
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
 *                     number:
 *                       type: string
 *                       example: "T-001-VIP"
 *                     capacity:
 *                       type: integer
 *                       example: 6
 *                     location:
 *                       type: string
 *                       example: "VIP section, window side"
 *                     isAvailable:
 *                       type: boolean
 *                       example: false
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T00:00:00.000Z
 *                 message:
 *                   type: string
 *                   example: Table updated successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Table not found
 *       409:
 *         description: Conflict - Table number already exists
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', authenticate, authorize(['admin']), updateTable);

/**
 * @openapi
 * /api/tables/{id}:
 *   delete:
 *     tags: [Tables]
 *     summary: Delete table
 *     description: Deletes a table. Admin access required. Cannot delete tables with active orders.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Table ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Table deleted successfully
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
 *                   example: Table deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Table not found
 *       409:
 *         description: Conflict - Cannot delete table with active orders
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticate, authorize(['admin']), deleteTable);

export default router;

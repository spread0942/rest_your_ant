import { Router } from 'express';
import {
  createMenu,
  getAllMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
} from '../controllers/menuController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

/**
 * @openapi
 * /api/menus:
 *   get:
 *     tags: [Menus]
 *     summary: Get all menus
 *     description: Retrieves a list of all menus. Authentication required.
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
 *         name: restaurantId
 *         schema:
 *           type: integer
 *         description: Filter menus by restaurant ID
 *     responses:
 *       200:
 *         description: List of menus retrieved successfully
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
 *                         example: "Dinner Menu"
 *                       description:
 *                         type: string
 *                         example: "Our special dinner selection"
 *                       category:
 *                         type: string
 *                         example: "dinner"
 *                       isActive:
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
 *                       example: 15
 *                     pages:
 *                       type: integer
 *                       example: 2
 *                 message:
 *                   type: string
 *                   example: Menus retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
// Protected routes (authentication required)
router.get('/', authenticate, getAllMenus);

/**
 * @openapi
 * /api/menus/{id}:
 *   get:
 *     tags: [Menus]
 *     summary: Get menu by ID
 *     description: Retrieves a specific menu by ID with associated plates. Authentication required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Menu ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Menu retrieved successfully
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
 *                       example: "Dinner Menu"
 *                     description:
 *                       type: string
 *                       example: "Our special dinner selection"
 *                     category:
 *                       type: string
 *                       example: "dinner"
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     restaurantId:
 *                       type: integer
 *                       example: 1
 *                     plates:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Margherita Pizza"
 *                           price:
 *                             type: number
 *                             example: 12.99
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
 *                   example: Menu retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Menu not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticate, getMenuById);

/**
 * @openapi
 * /api/menus:
 *   post:
 *     tags: [Menus]
 *     summary: Create new menu
 *     description: Creates a new menu for a restaurant. Admin access required.
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
 *               - restaurantId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Dinner Menu"
 *               description:
 *                 type: string
 *                 example: "Our special dinner selection"
 *               category:
 *                 type: string
 *                 example: "dinner"
 *               restaurantId:
 *                 type: integer
 *                 example: 1
 *               isActive:
 *                 type: boolean
 *                 default: true
 *                 example: true
 *     responses:
 *       201:
 *         description: Menu created successfully
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
 *                       example: "Dinner Menu"
 *                     description:
 *                       type: string
 *                       example: "Our special dinner selection"
 *                     category:
 *                       type: string
 *                       example: "dinner"
 *                     restaurantId:
 *                       type: integer
 *                       example: 1
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T00:00:00.000Z
 *                 message:
 *                   type: string
 *                   example: Menu created successfully
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
router.post('/', authenticate, /*authorize(['admin']),*/ createMenu);

/**
 * @openapi
 * /api/menus/{id}:
 *   patch:
 *     tags: [Menus]
 *     summary: Update menu
 *     description: Updates a menu. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Menu ID
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
 *                 example: "Updated Dinner Menu"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               isActive:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Menu updated successfully
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
 *                       example: "Updated Dinner Menu"
 *                     description:
 *                       type: string
 *                       example: "Updated description"
 *                     category:
 *                       type: string
 *                       example: "dinner"
 *                     isActive:
 *                       type: boolean
 *                       example: false
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T00:00:00.000Z
 *                 message:
 *                   type: string
 *                   example: Menu updated successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Menu not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', authenticate, /*authorize(['admin']),*/ updateMenu);

/**
 * @openapi
 * /api/menus/{id}:
 *   delete:
 *     tags: [Menus]
 *     summary: Delete menu
 *     description: Deletes a menu. Admin access required. This will also remove all plate associations.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Menu ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Menu deleted successfully
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
 *                   example: Menu deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Menu not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticate, /*authorize(['admin']),*/ deleteMenu);

export default router;

import { Router } from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     description: Retrieves a list of all users. Authentication required.
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
 *         description: Search users by account or tenant
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
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
 *                       accountId:
 *                         type: integer
 *                         example: 1
 *                       tenantId:
 *                         type: integer
 *                         example: 1
 *                       role:
 *                         type: string
 *                         enum: [owner, user]
 *                         example: "user"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-01-01T00:00:00.000Z
 *                       updatedAt:
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
 *                   example: Users retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
// Protected routes (authentication required)
router.get('/', authenticate, getUsers);

/**
 * @openapi
 * /api/users/{accountId}/{tenantId}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by composite key
 *     description: Retrieves a specific user by accountId and tenantId. Authentication required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID
 *         example: 1
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tenant ID
 *         example: 1
 *     responses:
 *       200:
 *         description: User retrieved successfully
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
 *                     accountId:
 *                       type: integer
 *                       example: 1
 *                     tenantId:
 *                       type: integer
 *                       example: 1
 *                     role:
 *                       type: string
 *                       enum: [owner, user]
 *                       example: "user"
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
 *                   example: User retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:accountId/:tenantId', authenticate, getUserById);

/**
 * @openapi
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Create new user
 *     description: Creates a new user association between an account and tenant.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountId
 *               - tenantId
 *             properties:
 *               accountId:
 *                 type: integer
 *                 example: 1
 *               tenantId:
 *                 type: integer
 *                 example: 1
 *               role:
 *                 type: string
 *                 enum: [owner, user]
 *                 default: user
 *                 example: "user"
 *     responses:
 *       201:
 *         description: User created successfully
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
 *                     accountId:
 *                       type: integer
 *                       example: 1
 *                     tenantId:
 *                       type: integer
 *                       example: 1
 *                     role:
 *                       type: string
 *                       enum: [owner, user]
 *                       example: "user"
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
 *                   example: User created successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       409:
 *         description: Conflict - User for this account and tenant already exists
 *       500:
 *         description: Internal server error
 */
router.post('/', createUser);

/**
 * @openapi
 * /api/users/{accountId}/{tenantId}:
 *   patch:
 *     tags: [Users]
 *     summary: Update user
 *     description: Updates a user's role. Authentication required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID
 *         example: 1
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tenant ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [owner, user]
 *                 example: "owner"
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                     accountId:
 *                       type: integer
 *                       example: 1
 *                     tenantId:
 *                       type: integer
 *                       example: 1
 *                     role:
 *                       type: string
 *                       enum: [owner, user]
 *                       example: "owner"
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
 *                   example: User updated successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:accountId/:tenantId', authenticate, updateUser);

/**
 * @openapi
 * /api/users/{accountId}/{tenantId}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user
 *     description: Deletes a user association between account and tenant. Authentication required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID
 *         example: 1
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tenant ID
 *         example: 1
 *     responses:
 *       200:
 *         description: User deleted successfully
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
 *                   example: User deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:accountId/:tenantId', authenticate, deleteUser);

export default router;

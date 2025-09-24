import { Router } from 'express';
import {
  createTenant,
  getTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
} from '../controllers/tenantController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @openapi
 * /api/tenants:
 *   get:
 *     tags: [Tenants]
 *     summary: Get all tenants
 *     description: Retrieves a list of all tenants for the authenticated user. Authentication required.
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
 *         description: Search tenants by name or domain
 *     responses:
 *       200:
 *         description: List of tenants retrieved successfully
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
 *                         example: "Acme Corporation"
 *                       domain:
 *                         type: string
 *                         nullable: true
 *                         example: "https://acmecorp.com"
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
 *                   example: Tenants retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
// Protected routes (authentication required)
router.get('/', authenticate, getTenants);

/**
 * @openapi
 * /api/tenants/{id}:
 *   get:
 *     tags: [Tenants]
 *     summary: Get tenant by ID
 *     description: Retrieves a specific tenant by ID. Authentication required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tenant ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Tenant retrieved successfully
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
 *                       example: "Acme Corporation"
 *                     domain:
 *                       type: string
 *                       nullable: true
 *                       example: "https://acmecorp.com"
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
 *                   example: Tenant retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Tenant not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticate, getTenantById);

/**
 * @openapi
 * /api/tenants:
 *   post:
 *     tags: [Tenants]
 *     summary: Create new tenant
 *     description: Creates a new tenant. Authentication required.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Acme Corporation"
 *               domain:
 *                 type: string
 *                 format: url
 *                 example: "https://acmecorp.com"
 *     responses:
 *       201:
 *         description: Tenant created successfully
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
 *                       example: "Acme Corporation"
 *                     domain:
 *                       type: string
 *                       nullable: true
 *                       example: "https://acmecorp.com"
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
 *                   example: Tenant created successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       409:
 *         description: Conflict - Tenant name already exists
 *       500:
 *         description: Internal server error
 */
// Protected routes (admin only)
router.post('/', createTenant);

/**
 * @openapi
 * /api/tenants/{id}:
 *   patch:
 *     tags: [Tenants]
 *     summary: Update tenant
 *     description: Updates a tenant. Authentication required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               name:
 *                 type: string
 *                 example: "Acme Corporation Updated"
 *               domain:
 *                 type: string
 *                 format: url
 *                 example: "https://new.acmecorp.com"
 *     responses:
 *       200:
 *         description: Tenant updated successfully
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
 *                       example: "Acme Corporation Updated"
 *                     domain:
 *                       type: string
 *                       nullable: true
 *                       example: "https://new.acmecorp.com"
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
 *                   example: Tenant updated successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Tenant not found
 *       409:
 *         description: Conflict - Tenant name already exists
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', authenticate, updateTenant);

/**
 * @openapi
 * /api/tenants/{id}:
 *   delete:
 *     tags: [Tenants]
 *     summary: Delete tenant
 *     description: Deletes a tenant. Authentication required. This will also remove all associated data (restaurants, users, etc.).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tenant ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Tenant deleted successfully
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
 *                   example: Tenant and all associated data deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Tenant not found
 *       409:
 *         description: Conflict - Cannot delete tenant with active data
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticate, deleteTenant);

export default router;

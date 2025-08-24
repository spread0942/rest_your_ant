import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

/**
 * @openapi
 * /api/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create new order
 *     description: Creates a new order for a customer. Authentication required.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurantId
 *               - orderItems
 *             properties:
 *               orderNumber:
 *                 type: string
 *                 example: "ORD-2023-001"
 *                 description: Auto-generated if not provided
 *               status:
 *                 type: string
 *                 enum: ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"]
 *                 default: "pending"
 *                 example: "pending"
 *               totalAmount:
 *                 type: number
 *                 minimum: 0
 *                 example: 45.99
 *                 description: Auto-calculated if not provided
 *               notes:
 *                 type: string
 *                 example: "Extra spicy, no onions"
 *               restaurantId:
 *                 type: integer
 *                 example: 1
 *               tableId:
 *                 type: integer
 *                 example: 5
 *                 description: Optional table assignment
 *               orderItems:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - plateId
 *                     - quantity
 *                   properties:
 *                     plateId:
 *                       type: integer
 *                       example: 1
 *                     drinkId:
 *                       type: integer
 *                       example: 2
 *                       description: Optional drink item
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 2
 *                     unitPrice:
 *                       type: number
 *                       minimum: 0
 *                       example: 12.99
 *                       description: Auto-filled from plate/drink price
 *                     notes:
 *                       type: string
 *                       example: "Medium rare"
 *     responses:
 *       201:
 *         description: Order created successfully
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
 *                     orderNumber:
 *                       type: string
 *                       example: "ORD-2023-001"
 *                     status:
 *                       type: string
 *                       example: "pending"
 *                     totalAmount:
 *                       type: number
 *                       example: 45.99
 *                     restaurantId:
 *                       type: integer
 *                       example: 1
 *                     tableId:
 *                       type: integer
 *                       example: 5
 *                     orderItems:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           plateId:
 *                             type: integer
 *                             example: 1
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                           unitPrice:
 *                             type: number
 *                             example: 12.99
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T00:00:00.000Z
 *                 message:
 *                   type: string
 *                   example: Order created successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Restaurant, table, plate, or drink not found
 *       500:
 *         description: Internal server error
 */
// Protected routes
router.post('/', authenticate, createOrder);

/**
 * @openapi
 * /api/orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get all orders
 *     description: Retrieves a list of orders. Regular users see only their orders, admins see all orders.
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"]
 *         description: Filter by order status
 *       - in: query
 *         name: restaurantId
 *         schema:
 *           type: integer
 *         description: Filter by restaurant ID
 *       - in: query
 *         name: tableId
 *         schema:
 *           type: integer
 *         description: Filter by table ID
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter orders from this date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter orders to this date
 *     responses:
 *       200:
 *         description: List of orders retrieved successfully
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
 *                       orderNumber:
 *                         type: string
 *                         example: "ORD-2023-001"
 *                       status:
 *                         type: string
 *                         example: "preparing"
 *                       totalAmount:
 *                         type: number
 *                         example: 45.99
 *                       customerName:
 *                         type: string
 *                         example: "John Doe"
 *                       restaurantId:
 *                         type: integer
 *                         example: 1
 *                       tableId:
 *                         type: integer
 *                         example: 5
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
 *                       example: 150
 *                     pages:
 *                       type: integer
 *                       example: 15
 *                 message:
 *                   type: string
 *                   example: Orders retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticate, getAllOrders);

/**
 * @openapi
 * /api/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order by ID
 *     description: Retrieves a specific order by ID with detailed information. Users can only access their own orders, admins can access any order.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Order retrieved successfully
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
 *                     orderNumber:
 *                       type: string
 *                       example: "ORD-2023-001"
 *                     status:
 *                       type: string
 *                       example: "preparing"
 *                     totalAmount:
 *                       type: number
 *                       example: 45.99
 *                     notes:
 *                       type: string
 *                       example: "Extra spicy, no onions"
 *                     restaurantId:
 *                       type: integer
 *                       example: 1
 *                     tableId:
 *                       type: integer
 *                       example: 5
 *                     table:
 *                       type: object
 *                       properties:
 *                         number:
 *                           type: string
 *                           example: "T-005"
 *                         capacity:
 *                           type: integer
 *                           example: 4
 *                     orderItems:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           plateId:
 *                             type: integer
 *                             example: 1
 *                           plate:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: "Margherita Pizza"
 *                               category:
 *                                 type: string
 *                                 example: "Pizza"
 *                           drinkId:
 *                             type: integer
 *                             example: 2
 *                           drink:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: "Coca Cola"
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                           unitPrice:
 *                             type: number
 *                             example: 12.99
 *                           notes:
 *                             type: string
 *                             example: "Medium rare"
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
 *                   example: Order retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Access denied
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticate, getOrderById);

/**
 * @openapi
 * /api/orders/{id}:
 *   patch:
 *     tags: [Orders]
 *     summary: Update order
 *     description: Updates an order. Customers can update their pending orders, staff can update status and details.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"]
 *                 example: "confirmed"
 *               notes:
 *                 type: string
 *                 example: "Updated notes - no allergies"
 *               tableId:
 *                 type: integer
 *                 example: 7
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                       description: Include ID for existing items to update
 *                     plateId:
 *                       type: integer
 *                       example: 2
 *                     drinkId:
 *                       type: integer
 *                       example: 3
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 1
 *                     notes:
 *                       type: string
 *                       example: "Well done"
 *     responses:
 *       200:
 *         description: Order updated successfully
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
 *                     orderNumber:
 *                       type: string
 *                       example: "ORD-2023-001"
 *                     status:
 *                       type: string
 *                       example: "confirmed"
 *                     totalAmount:
 *                       type: number
 *                       example: 38.99
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T00:00:00.000Z
 *                 message:
 *                   type: string
 *                   example: Order updated successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Cannot modify order in current status
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', authenticate, updateOrder);

/**
 * @openapi
 * /api/orders/{id}:
 *   delete:
 *     tags: [Orders]
 *     summary: Delete order
 *     description: Deletes an order. Admin access required. Only pending or cancelled orders can be deleted.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Order deleted successfully
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
 *                   example: Order deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required or cannot delete order in current status
 *       404:
 *         description: Order not found
 *       409:
 *         description: Conflict - Cannot delete order in current status
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticate, authorize(['admin']), deleteOrder);

export default router;

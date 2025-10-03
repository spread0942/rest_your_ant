import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  addPlateToOrder,
  addProductToOrderPlate,
  addDrinkToOrder,
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
 *             properties:
 *               restaurantId:
 *                 type: integer
 *                 example: 1
 *               tableId:
 *                 type: integer
 *                 example: 5
 *                 description: Optional table assignment
 *               status:
 *                 type: string
 *                 enum: ["pending", "preparing", "ready", "delivered", "cancelled"]
 *                 example: "pending"
 *               notes:
 *                 type: string
 *                 example: "Extra spicy, no onions"
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
 *                     restaurantId:
 *                       type: integer
 *                       example: 1
 *                     tableId:
 *                       type: integer
 *                       example: 5
 *                     status:
 *                       type: string
 *                       example: "pending"
 *                     notes:
 *                       type: string
 *                       example: "Extra spicy, no onions"
 *                     totalAmount:
 *                       type: number
 *                       example: 0
 *                     restaurant:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "Pizza Palace"
 *                     table:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 5
 *                         number:
 *                           type: string
 *                           example: "T-005"
 *                         seats:
 *                           type: integer
 *                           example: 4
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
 *           enum: ["pending", "preparing", "ready", "delivered", "cancelled"]
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
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           restaurantId:
 *                             type: integer
 *                             example: 1
 *                           tableId:
 *                             type: integer
 *                             example: 5
 *                           status:
 *                             type: string
 *                             example: "preparing"
 *                           notes:
 *                             type: string
 *                             example: "Extra spicy"
 *                           totalAmount:
 *                             type: number
 *                             example: 45.99
 *                           restaurant:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 1
 *                               name:
 *                                 type: string
 *                                 example: "Pizza Palace"
 *                           table:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 5
 *                               number:
 *                                 type: string
 *                                 example: "T-005"
 *                           orderPlates:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                   example: 1
 *                                 quantity:
 *                                   type: integer
 *                                   example: 2
 *                                 plate:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: integer
 *                                       example: 1
 *                                     name:
 *                                       type: string
 *                                       example: "Margherita Pizza"
 *                           orderDrinks:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                   example: 1
 *                                 quantity:
 *                                   type: integer
 *                                   example: 1
 *                                 drink:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: integer
 *                                       example: 2
 *                                     name:
 *                                       type: string
 *                                       example: "Coca Cola"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2023-01-01T00:00:00.000Z
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
 *                     restaurantId:
 *                       type: integer
 *                       example: 1
 *                     tableId:
 *                       type: integer
 *                       example: 5
 *                     status:
 *                       type: string
 *                       example: "preparing"
 *                     notes:
 *                       type: string
 *                       example: "Extra spicy, no onions"
 *                     totalAmount:
 *                       type: number
 *                       example: 45.99
 *                     restaurant:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "Pizza Palace"
 *                     table:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 5
 *                         number:
 *                           type: string
 *                           example: "T-005"
 *                         seats:
 *                           type: integer
 *                           example: 4
 *                     orderPlates:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                           unitPrice:
 *                             type: number
 *                             example: 12.99
 *                           subtotal:
 *                             type: number
 *                             example: 25.98
 *                           notes:
 *                             type: string
 *                             example: "Medium rare"
 *                           plate:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 1
 *                               name:
 *                                 type: string
 *                                 example: "Margherita Pizza"
 *                     orderDrinks:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           quantity:
 *                             type: integer
 *                             example: 1
 *                           unitPrice:
 *                             type: number
 *                             example: 3.50
 *                           subtotal:
 *                             type: number
 *                             example: 3.50
 *                           drink:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 2
 *                               name:
 *                                 type: string
 *                                 example: "Coca Cola"
 *                     orderPlateProducts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           quantity:
 *                             type: integer
 *                             example: 1
 *                           price:
 *                             type: number
 *                             example: 2.00
 *                           action:
 *                             type: string
 *                             enum: ["add", "remove"]
 *                             example: "add"
 *                           product:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 1
 *                               name:
 *                                 type: string
 *                                 example: "Extra Cheese"
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
 *               restaurantId:
 *                 type: integer
 *                 example: 1
 *               tableId:
 *                 type: integer
 *                 example: 7
 *               status:
 *                 type: string
 *                 enum: ["pending", "preparing", "ready", "delivered", "cancelled"]
 *                 example: "pending"
 *               notes:
 *                 type: string
 *                 example: "Updated notes - no allergies"
 *               orderDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-01-01T12:00:00.000Z"
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
 *                     restaurantId:
 *                       type: integer
 *                       example: 1
 *                     tableId:
 *                       type: integer
 *                       example: 7
 *                     status:
 *                       type: string
 *                       example: "preparing"
 *                     notes:
 *                       type: string
 *                       example: "Updated notes - no allergies"
 *                     totalAmount:
 *                       type: number
 *                       example: 38.99
 *                     restaurant:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "Pizza Palace"
 *                     table:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 7
 *                         number:
 *                           type: string
 *                           example: "T-007"
 *                     orderPlates:
 *                       type: array
 *                       items:
 *                         type: object
 *                     orderDrinks:
 *                       type: array
 *                       items:
 *                         type: object
 *                     orderPlateProducts:
 *                       type: array
 *                       items:
 *                         type: object
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
 *     description: Deletes an order. Only orders within the user's tenant can be deleted.
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
 *                 data:
 *                   type: null
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: Order deleted successfully
 *       400:
 *         description: Bad request - User tenant ID required
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticate, deleteOrder);

/**
 * @openapi
 * /api/orders/{orderId}/plates:
 *   post:
 *     tags: [Orders]
 *     summary: Add plate to order
 *     description: Adds a plate to an existing order with specified quantity
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
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
 *             required:
 *               - plateId
 *               - quantity
 *             properties:
 *               plateId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *               notes:
 *                 type: string
 *                 example: "Medium rare"
 *     responses:
 *       201:
 *         description: Plate added to order successfully
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
 *                     orderId:
 *                       type: integer
 *                       example: 1
 *                     plateId:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *                     unitPrice:
 *                       type: number
 *                       example: 12.99
 *                     subtotal:
 *                       type: number
 *                       example: 25.98
 *                     notes:
 *                       type: string
 *                       example: "Medium rare"
 *                     plate:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "Margherita Pizza"
 *                 message:
 *                   type: string
 *                   example: Plate added to order successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Order or plate not found
 *       500:
 *         description: Internal server error
 */
router.post('/:orderId/plates', authenticate, addPlateToOrder);

/**
 * @openapi
 * /api/orders/plates/{orderPlateId}/products:
 *   post:
 *     tags: [Orders]
 *     summary: Add product to order plate
 *     description: Adds or removes a product from an order plate (plate customization)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderPlateId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order Plate ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *               - action
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *               action:
 *                 type: string
 *                 enum: ["add", "remove"]
 *                 example: "add"
 *                 description: Whether to add or remove the product
 *               notes:
 *                 type: string
 *                 example: "Extra portion"
 *     responses:
 *       201:
 *         description: Product added to order plate successfully
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
 *                     orderPlateId:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       example: 1
 *                     price:
 *                       type: number
 *                       example: 2.00
 *                     subtotal:
 *                       type: number
 *                       example: 2.00
 *                     action:
 *                       type: string
 *                       example: "add"
 *                     notes:
 *                       type: string
 *                       example: "Extra portion"
 *                     product:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "Extra Cheese"
 *                 message:
 *                   type: string
 *                   example: Product added to order plate successfully
 *       400:
 *         description: Bad request - Invalid input data or action
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Order plate or product not found
 *       500:
 *         description: Internal server error
 */
router.post('/plates/:orderPlateId/products', authenticate, addProductToOrderPlate);

/**
 * @openapi
 * /api/orders/{orderId}/drinks:
 *   post:
 *     tags: [Orders]
 *     summary: Add drink to order
 *     description: Adds a drink to an existing order with specified quantity
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
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
 *             required:
 *               - drinkId
 *               - quantity
 *             properties:
 *               drinkId:
 *                 type: integer
 *                 example: 2
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *               notes:
 *                 type: string
 *                 example: "No ice"
 *     responses:
 *       201:
 *         description: Drink added to order successfully
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
 *                     orderId:
 *                       type: integer
 *                       example: 1
 *                     drinkId:
 *                       type: integer
 *                       example: 2
 *                     quantity:
 *                       type: integer
 *                       example: 1
 *                     unitPrice:
 *                       type: number
 *                       example: 3.50
 *                     subtotal:
 *                       type: number
 *                       example: 3.50
 *                     notes:
 *                       type: string
 *                       example: "No ice"
 *                     drink:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 2
 *                         name:
 *                           type: string
 *                           example: "Coca Cola"
 *                 message:
 *                   type: string
 *                   example: Drink added to order successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Order or drink not found
 *       500:
 *         description: Internal server error
 */
router.post('/:orderId/drinks', authenticate, addDrinkToOrder);

export default router;

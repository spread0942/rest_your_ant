import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

/**
 * @openapi
 * /api/products:
 *   post:
 *     tags: [Products]
 *     summary: Create new product
 *     description: Creates a new product/ingredient. Admin access required.
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
 *               - category
 *               - unit
 *               - restaurantId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Mozzarella Cheese"
 *               description:
 *                 type: string
 *                 example: "Fresh mozzarella cheese for pizzas"
 *               category:
 *                 type: string
 *                 example: "Dairy"
 *               unit:
 *                 type: string
 *                 enum: ["kg", "g", "l", "ml", "pcs", "lbs"]
 *                 example: "kg"
 *               stockQuantity:
 *                 type: number
 *                 minimum: 0
 *                 example: 50.5
 *               minimumStock:
 *                 type: number
 *                 minimum: 0
 *                 example: 10
 *               unitCost:
 *                 type: number
 *                 minimum: 0
 *                 example: 8.50
 *               supplier:
 *                 type: string
 *                 example: "Local Dairy Farm"
 *               expirationDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-12-31"
 *               isActive:
 *                 type: boolean
 *                 default: true
 *                 example: true
 *               restaurantId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Product created successfully
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
 *                       example: "Mozzarella Cheese"
 *                     category:
 *                       type: string
 *                       example: "Dairy"
 *                     stockQuantity:
 *                       type: number
 *                       example: 50.5
 *                     unit:
 *                       type: string
 *                       example: "kg"
 *                     restaurantId:
 *                       type: integer
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T00:00:00.000Z
 *                 message:
 *                   type: string
 *                   example: Product created successfully
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
router.post('/', authenticate, authorize(['admin']), createProduct);

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Get all products
 *     description: Retrieves a list of all products/ingredients for inventory management. Admin access required.
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
 *         description: Filter by product category
 *       - in: query
 *         name: lowStock
 *         schema:
 *           type: boolean
 *         description: Filter products with low stock (below minimum)
 *       - in: query
 *         name: restaurantId
 *         schema:
 *           type: integer
 *         description: Filter by restaurant ID
 *     responses:
 *       200:
 *         description: List of products retrieved successfully
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
 *                         example: "Mozzarella Cheese"
 *                       category:
 *                         type: string
 *                         example: "Dairy"
 *                       stockQuantity:
 *                         type: number
 *                         example: 50.5
 *                       minimumStock:
 *                         type: number
 *                         example: 10
 *                       unit:
 *                         type: string
 *                         example: "kg"
 *                       unitCost:
 *                         type: number
 *                         example: 8.50
 *                       supplier:
 *                         type: string
 *                         example: "Local Dairy Farm"
 *                       expirationDate:
 *                         type: string
 *                         format: date
 *                         example: "2023-12-31"
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
 *                       example: 75
 *                     pages:
 *                       type: integer
 *                       example: 8
 *                 message:
 *                   type: string
 *                   example: Products retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticate, authorize(['admin']), getAllProducts);

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by ID
 *     description: Retrieves a specific product by ID with detailed information. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Product retrieved successfully
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
 *                       example: "Mozzarella Cheese"
 *                     description:
 *                       type: string
 *                       example: "Fresh mozzarella cheese for pizzas"
 *                     category:
 *                       type: string
 *                       example: "Dairy"
 *                     unit:
 *                       type: string
 *                       example: "kg"
 *                     stockQuantity:
 *                       type: number
 *                       example: 50.5
 *                     minimumStock:
 *                       type: number
 *                       example: 10
 *                     unitCost:
 *                       type: number
 *                       example: 8.50
 *                     supplier:
 *                       type: string
 *                       example: "Local Dairy Farm"
 *                     expirationDate:
 *                       type: string
 *                       format: date
 *                       example: "2023-12-31"
 *                     isActive:
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
 *                   example: Product retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticate, authorize(['admin']), getProductById);

/**
 * @openapi
 * /api/products/{id}:
 *   patch:
 *     tags: [Products]
 *     summary: Update product
 *     description: Updates a product/ingredient. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
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
 *                 example: "Premium Mozzarella Cheese"
 *               description:
 *                 type: string
 *                 example: "Updated premium quality mozzarella"
 *               category:
 *                 type: string
 *                 example: "Premium Dairy"
 *               stockQuantity:
 *                 type: number
 *                 minimum: 0
 *                 example: 75.0
 *               minimumStock:
 *                 type: number
 *                 minimum: 0
 *                 example: 15
 *               unitCost:
 *                 type: number
 *                 minimum: 0
 *                 example: 9.50
 *               supplier:
 *                 type: string
 *                 example: "Premium Dairy Farm"
 *               expirationDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-31"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Product updated successfully
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
 *                       example: "Premium Mozzarella Cheese"
 *                     stockQuantity:
 *                       type: number
 *                       example: 75.0
 *                     unitCost:
 *                       type: number
 *                       example: 9.50
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-01-01T00:00:00.000Z
 *                 message:
 *                   type: string
 *                   example: Product updated successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', authenticate, authorize(['admin']), updateProduct);

/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Delete product
 *     description: Deletes a product/ingredient. Admin access required. This will remove the product from all plate recipes.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Product deleted successfully
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
 *                   example: Product deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
// Protected routes (admin only for all product operations)
router.delete('/:id', authenticate, authorize(['admin']), deleteProduct);

export default router;

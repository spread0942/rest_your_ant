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
 *               - unit
 *               - price
 *               - restaurantId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Mozzarella Cheese"
 *               description:
 *                 type: string
 *                 example: "Fresh mozzarella cheese for pizzas"
 *               unit:
 *                 type: string
 *                 example: "kg"
 *               price:
 *                 type: number
 *                 format: decimal
 *                 minimum: 0
 *                 example: 8.50
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 default: 0
 *                 example: 50
 *               minStock:
 *                 type: integer
 *                 minimum: 0
 *                 default: 0
 *                 example: 10
 *               allergens:
 *                 type: string
 *                 enum: ["gluten", "crustaceans", "eggs", "fish", "peanuts", "soy", "milk", "nuts", "celery", "mustard", "sesame", "sulphites", "lupin", "molluscs"]
 *                 example: "milk"
 *                 description: "Allergen information for the product"
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
 *                     description:
 *                       type: string
 *                       example: "Fresh mozzarella cheese for pizzas"
 *                     unit:
 *                       type: string
 *                       example: "kg"
 *                     price:
 *                       type: number
 *                       format: decimal
 *                       example: 8.50
 *                     stock:
 *                       type: integer
 *                       example: 50
 *                     minStock:
 *                       type: integer
 *                       example: 10
 *                     allergens:
 *                       type: string
 *                       enum: ["gluten", "crustaceans", "eggs", "fish", "peanuts", "soy", "milk", "nuts", "celery", "mustard", "sesame", "sulphites", "lupin", "molluscs"]
 *                       example: "milk"
 *                       description: "Allergen information for the product"
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
 *         name: lowStock
 *         schema:
 *           type: boolean
 *         description: Filter products with low stock (below minimum stock level)
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
 *                       description:
 *                         type: string
 *                         example: "Fresh mozzarella cheese for pizzas"
 *                       unit:
 *                         type: string
 *                         example: "kg"
 *                       price:
 *                         type: number
 *                         format: decimal
 *                         example: 8.50
 *                       stock:
 *                         type: integer
 *                         example: 50
 *                       minStock:
 *                         type: integer
 *                         example: 10
 *                       allergens:
 *                         type: string
 *                         enum: ["gluten", "crustaceans", "eggs", "fish", "peanuts", "soy", "milk", "nuts", "celery", "mustard", "sesame", "sulphites", "lupin", "molluscs"]
 *                         example: "milk"
 *                         description: "Allergen information for the product"
 *                       restaurantId:
 *                         type: integer
 *                         example: 1
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
 *                     unit:
 *                       type: string
 *                       example: "kg"
 *                     price:
 *                       type: number
 *                       format: decimal
 *                       example: 8.50
 *                     stock:
 *                       type: integer
 *                       example: 50
 *                     minStock:
 *                       type: integer
 *                       example: 10
 *                     allergens:
 *                       type: string
 *                       enum: ["gluten", "crustaceans", "eggs", "fish", "peanuts", "soy", "milk", "nuts", "celery", "mustard", "sesame", "sulphites", "lupin", "molluscs"]
 *                       example: "milk"
 *                       description: "Allergen information for the product"
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
 *               unit:
 *                 type: string
 *                 example: "kg"
 *               price:
 *                 type: number
 *                 format: decimal
 *                 minimum: 0
 *                 example: 9.50
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 75
 *               minStock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 15
 *               allergens:
 *                 type: string
 *                 enum: ["gluten", "crustaceans", "eggs", "fish", "peanuts", "soy", "milk", "nuts", "celery", "mustard", "sesame", "sulphites", "lupin", "molluscs"]
 *                 example: "milk"
 *                 description: "Allergen information for the product"
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
 *                     description:
 *                       type: string
 *                       example: "Updated premium quality mozzarella"
 *                     unit:
 *                       type: string
 *                       example: "kg"
 *                     price:
 *                       type: number
 *                       format: decimal
 *                       example: 9.50
 *                     stock:
 *                       type: integer
 *                       example: 75
 *                     minStock:
 *                       type: integer
 *                       example: 15
 *                     allergens:
 *                       type: string
 *                       enum: ["gluten", "crustaceans", "eggs", "fish", "peanuts", "soy", "milk", "nuts", "celery", "mustard", "sesame", "sulphites", "lupin", "molluscs"]
 *                       example: "milk"
 *                       description: "Allergen information for the product"
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

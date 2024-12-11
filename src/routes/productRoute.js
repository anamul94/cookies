const express = require('express');
const { createProduct, getProductById, updateProduct, searchProducts } = require('../controllers/productCtrl');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /products/create:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - url
 *               - cookie
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the product
 *                 example: My Product
 *               url:
 *                 type: string
 *                 description: The product's URL
 *                 example: https://example.com
 *               cookie:
 *                 type: object
 *                 description: Cookie information in JSON format
 *                 example:
 *                   sessionId: abc123
 *                   token: xyz456
 *               status:
 *                 type: string
 *                 description: The status of the product (active or inactive)
 *                 example: active
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product created successfully
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: My Product
 *                     url:
 *                       type: string
 *                       example: https://example.com
 *                     cookie:
 *                       type: object
 *                       example:
 *                         sessionId: abc123
 *                         token: xyz456
 *                     status:
 *                       type: string
 *                       example: active
 *                     createdBy:
 *                       type: integer
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       example: 2024-12-11T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       example: 2024-12-11T12:00:00.000Z
 *       400:
 *         description: Bad request (e.g., missing required fields)
 *       401:
 *         description: Unauthorized (no token provided)
 *       403:
 *         description: Forbidden (invalid or expired token)
 *       500:
 *         description: Server error
 */
router.post('/create', authenticate, createProduct);



/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by its ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: My Product
 *                     url:
 *                       type: string
 *                       example: https://example.com
 *                     cookie:
 *                       type: object
 *                       example:
 *                         sessionId: abc123
 *                         token: xyz456
 *                     status:
 *                       type: string
 *                       example: active
 *                     createdBy:
 *                       type: integer
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       example: 2024-12-11T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       example: 2024-12-11T12:00:00.000Z
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get('/:id',  getProductById);


/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by its ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The new title of the product
 *                 example: Updated Product
 *               url:
 *                 type: string
 *                 description: The new URL of the product
 *                 example: https://updated-example.com
 *               cookie:
 *                 type: object
 *                 description: Updated cookie information
 *                 example:
 *                   sessionId: updated123
 *                   token: updatedToken
 *               status:
 *                 type: string
 *                 description: The new status of the product (active or inactive)
 *                 example: inactive
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product updated successfully
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: Updated Product
 *                     url:
 *                       type: string
 *                       example: https://updated-example.com
 *                     cookie:
 *                       type: object
 *                       example:
 *                         sessionId: updated123
 *                         token: updatedToken
 *                     status:
 *                       type: string
 *                       example: inactive
 *                     createdBy:
 *                       type: integer
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       example: 2024-12-11T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       example: 2024-12-11T13:00:00.000Z
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticate, updateProduct);


/**
 * @swagger
 * /products/search:
 *   post:
 *     summary: Search for products by title and status with pagination
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Filter products by title (partial match)
 *                 example: My Product
 *               status:
 *                 type: string
 *                 description: Filter products by status
 *                 enum: [active, inactive]
 *                 example: active
 *               page:
 *                 type: integer
 *                 description: Page number for pagination
 *                 example: 1
 *               limit:
 *                 type: integer
 *                 description: Number of products per page
 *                 example: 10
 *     responses:
 *       200:
 *         description: A paginated list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 50
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: My Product
 *                       url:
 *                         type: string
 *                         example: https://example.com
 *                       cookie:
 *                         type: object
 *                         example:
 *                           sessionId: abc123
 *                           token: xyz456
 *                       status:
 *                         type: string
 *                         example: active
 *                       createdBy:
 *                         type: integer
 *                         example: 1
 *                       createdAt:
 *                         type: string
 *                         example: 2024-12-11T12:00:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         example: 2024-12-11T12:00:00.000Z
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post('/search',  searchProducts);



module.exports = router;

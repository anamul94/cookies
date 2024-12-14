const express = require('express');
const router = express.Router();
const { createOrder, getActiveOrdersByEmail, getActiveProductsByCustomerEmail, createTrialOrder, searchOrdersWithPagination, getOrderById } = require('../controllers/orderController'); 
const multer = require("multer");
const upload = multer({ dest: "uploads/" });



/**
 * @swagger
 * /order/create:
 *   post:
 *     summary: Create a new order for a customer
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerEmail
 *               - customerName
 *               - planIds
 *               - phoneNumber
 *               - transactionNumber
 *               - paymentMethod
 *             properties:
 *               customerEmail:
 *                 type: string
 *                 description: The customer's email address
 *               customerName:
 *                 type: string
 *                 description: The customer's name
 *               planIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: The ID of the selected plan
 *               phoneNumber:
 *                 type: string
 *                 description: Customer mobile banking phone number
 *               transactionNumber:
 *                 type: string
 *                 description: Transaction Number
 *               paymentMethod:
 *                 type: string
 *                 enum:
 *                   - bkash
 *                   - nagad
 *                   - card
 *                   - others
 *                 description: Payment Method
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Plan not found or is inactive
 *       500:
 *         description: Error creating order
 */


router.post('/create', createOrder);



/**
 * @swagger
 * /order/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Order]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the order to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested order
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error fetching order
 */

router.get(('/:id'), getOrderById);


/**
 * @swagger
 * /order/active:
 *   get:
 *     summary: Get all active orders by customer's email
 *     tags: [Order]
 *     parameters:
 *       - in: query
 *         name: customerEmail
 *         schema:
 *           type: string
 *         required: true
 *         description: Customer's email address
 *     responses:
 *       200:
 *         description: Successfully retrieved active orders
 *       400:
 *         description: Missing customer email
 *       404:
 *         description: No active orders found
 *       500:
 *         description: Server error
 */
router.get('/active', getActiveOrdersByEmail);



/**
 * @swagger
 * /order/products:
 *   get:
 *     summary: Get active products by customer email
 *     tags: [Order]
 *     parameters:
 *       - in: query
 *         name: customerEmail
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: The customer's email address
 *       - in: query
 *         name: mac
 *         required: true
 *         schema:
 *           type: string
 *           format: string
 *         description: The customer's MAC address
 *     responses:
 *       200:
 *         description: List of active products with remaining days
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productTitle:
 *                     type: string
 *                     description: The title of the product
 *                   productUrl:
 *                     type: string
 *                     description: The URL of the product
 *                   cookie:
 *                     type: string
 *                     description: The product cookie value
 *                   remainingDays:
 *                     type: integer
 *                     description: The number of days remaining before the order expires
 *             example:
 *               - productTitle: "Premium Cookie Subscription"
 *                 productUrl: "https://example.com/product/1"
 *                 cookie: "abcd1234"
 *                 remainingDays: 15
 *               - productTitle: "Exclusive Membership"
 *                 productUrl: "https://example.com/product/2"
 *                 cookie: "xyz9876"
 *                 remainingDays: 5
 *       400:
 *         description: Invalid email provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid email provided"
 *       404:
 *         description: No active orders found for the customer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No active orders found for this email"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */
router.get('/products', getActiveProductsByCustomerEmail);


/**
 * @swagger
 * /order/createTrialOrder:
 *   post:
 *     summary: Create a new order for a customer
 *     tags: 
 *       - Order
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The customer's name
 *                 example: John Doe
 *               customerEmail:
 *                 type: string
 *                 description: The customer's email address
 *                 format: email
 *                 example: johndoe@example.com
 *               phoneNumber:
 *                 type: string
 *                 description: Customer mobile banking phone number
 *                 example: +1234567890
 *               facebookId:
 *                 type: string
 *                 description: Facebook ID
 *                 example: 123456789
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Customer's image file
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order created successfully
 *                 order:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     customerEmail:
 *                       type: string
 *                       example: johndoe@example.com
 *                     phoneNumber:
 *                       type: string
 *                       example: +1234567890
 *                     facebookId:
 *                       type: string
 *                       example: 123456789
 *                     ssId:
 *                       type: string
 *                       example: 987654321
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid request data
 *       404:
 *         description: Plan not found or is inactive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plan not found or is inactive
 *       500:
 *         description: Error creating order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error creating order
 *                 error:
 *                   type: string
 */
router.post('/createTrialOrder', upload.single('image'), createTrialOrder);


/**
 * @swagger
 * /order/search:
 *   post:
 *     summary: Search for orders with pagination
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page:
 *                 type: integer
 *                 description: Page number for pagination
 *                 example: 1
 *               limit:
 *                 type: integer
 *                 description: Number of records per page
 *                 example: 10
 *               customerEmail:
 *                 type: string
 *                 description: Customer's email address
 *                 example: johndoe@example.com
 *               status:
 *                 type: string
 *                 description: Order status
 *                 example: active
 *     responses:
 *       200:
 *         description: Successfully retrieved orders with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 10
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       customerEmail:
 *                         type: string
 *                         example: johndoe@example.com
 *                       status:
 *                         type: string
 *                         example: active
 *                       createdAt:
 *                         type: string
 *                         example: 2023-06-01T10:00:00.000Z
 *       500:
 *         description: Error searching orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error searching orders
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/search', searchOrdersWithPagination);
module.exports = router;

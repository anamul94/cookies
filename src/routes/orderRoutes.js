const express = require('express');
const router = express.Router();
const { createOrder, getActiveOrdersByEmail, getActiveProductsByCustomerEmail, createTrialOrder, searchOrdersWithPagination, getOrderById, updateOrder } = require('../controllers/orderController'); 
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
 * /order/{id}:
 *   put:
 *     summary: Update an order's status or email
 *     tags: [Order]
 *     description: Updates the status or customer email of an order by its ID. Only fields provided in the request body will be updated.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerEmail:
 *                 type: string
 *                 description: The new email of the customer
 *               status:
 *                 type: string
 *                 description: The new status of the order
 *             example:
 *               customerEmail: "example@domain.com"
 *               status: "active"
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order updated successfully"
 *                 order:
 *                   type: object
 *                   description: The updated order details
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order not found"
 *       500:
 *         description: Error updating order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating order"
 *                 error:
 *                   type: string
 */

router.put('/:id', updateOrder);






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

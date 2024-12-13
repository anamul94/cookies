const express = require('express');
const router = express.Router();
const { createOrder, getActiveOrdersByEmail, getActiveProductsByCustomerEmail } = require('../controllers/orderController'); 


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
 *             properties:
 *               customerEmail:
 *                 type: string
 *                 description: The customer's email address
 *               planId:
 *                 type: integer
 *                 description: The ID of the selected plan
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The start date of the order
 *               durationType:
 *                 type: string
 *                 enum: [days, month, year]
 *                 description: The duration type of the plan (e.g., "days", "month", "year")
 *               durationValue:
 *                 type: integer
 *                 description: The duration value (number of days, months, or years)
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
module.exports = router;

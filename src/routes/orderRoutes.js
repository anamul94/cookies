const express = require('express');
const { createOrder } = require('../controllers/orderController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();


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
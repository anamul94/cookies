const express = require('express');
const router = express.Router();
const { createCustomer, genNewPassword, } = require('../controllers/customerController');


/**
 * @swagger
 * /customer/create:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The customer's email address
 *               name:
 *                 type: string
 *                 description: The customer's name
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   description: The customer's email address
 *                 password:
 *                   type: string
 *                   description: The customer's password
 *                 name:
 *                   type: string
 *                   description: The customer's name
 */

router.post('/create', createCustomer);

/**
 * @swagger
 * /customer/newPassword:
 *   post:
 *     summary: Generate a new password for a customer
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The customer's email address
 *     responses:
 *       200:
 *         description: New password sent to the customer's email
 *       400:
 *         description: Customer not found  
 */
router.post('/newPassword', genNewPassword);
// router.get('/', getCustomers);
// router.get('/:id', getCustomerById);

module.exports = router;
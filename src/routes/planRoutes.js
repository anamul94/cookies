const express = require('express');
const { createPackage: createPlan, getPlanById, getPlansByProductId, updatePlan, getAllPackages } = require('../controllers/packageController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /plans:
 *   post:
 *     summary: Create a new plan
 *     tags: [Plans]
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
 *               - price
 *               - productID
 *               - durationType
 *               - durationValue
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the plan
 *               price:
 *                 type: number
 *                 description: Price of the plan
 *               productID:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: IDS of the product associated with the plan
 *                 example: [1, 2, 3]
 *               durationType:
 *                 type: string
 *                 description: Type of duration (days, month, year)
 *                 enum:
 *                   - days
 *                   - month
 *                   - year
 *               durationValue:
 *                 type: integer
 *                 description: Value of the duration
 *               status:
 *                 type: string
 *                 description: Status of the plan (active, inactive)
 *                 enum:
 *                   - active
 *                   - inactive
 *     responses:
 *       201:
 *         description: Plan created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/plans', createPlan);

/**
 * @swagger
 * /plans:
 *   get:
 *     summary: Get all available plans
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved a list of plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: Title of the plan
 *                     example: Package Three
 *                   price:
 *                     type: number
 *                     description: Price of the plan
 *                     example: 330
 *                   productID:
 *                     type: array
 *                     items:
 *                       type: integer
 *                     description: IDs of the products associated with the plan
 *                     example: [2]
 *                   durationType:
 *                     type: string
 *                     description: Type of duration (days, month, year)
 *                     example: days
 *                     enum:
 *                       - days
 *                       - month
 *                       - year
 *                   durationValue:
 *                     type: integer
 *                     description: Value of the duration
 *                     example: 30
 *                   status:
 *                     type: string
 *                     description: Status of the plan (active, inactive)
 *                     example: active
 *                     enum:
 *                       - active
 *                       - inactive
 *       500:
 *         description: Server error
 */

router.get('/plans',getAllPackages)

// Route to get plan by ID
/**
 * @swagger
 * /plan/{id}:
 *   get:
 *     summary: Get a plan by ID
 *     tags: [Plans]
 *     security:
 *       - BearerAuth: [] # JWT token
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the plan to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested plan
 *       404:
 *         description: Plan not found
 *       500:
 *         description: Error fetching plan
 */

router.get('/plan/:id', getPlanById);

// Route to get plans by Product ID
/**
 * @swagger
 * /plans/product/{productId}:
 *   get:
 *     summary: Get all plans by Product ID
 *     tags: [Plans]
 *     security:
 *       - BearerAuth: [] # JWT token
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: ID of the product whose plans to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of plans for the product
 *       404:
 *         description: No plans found
 *       500:
 *         description: Error fetching plans
 */

router.get('/plans/product/:productId', getPlansByProductId);


// Route to update a plan by ID
/**
 * @swagger
 * /plan/{id}:
 *   put:
 *     summary: Update a plan by ID
 *     tags: [Plans]
 *     security:
 *       - BearerAuth: [] # JWT token
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the plan to update
 *         schema:
 *           type: integer
 *       - name: title
 *         in: body
 *         description: Title of the plan
 *         required: false
 *         schema:
 *           type: string
 *       - name: price
 *         in: body
 *         description: Price of the plan
 *         required: false
 *         schema:
 *           type: number
 *           format: float
 *       - name: productID
 *         in: body
 *         description: ID of the associated product
 *         required: false
 *         schema:
 *           type: integer
 *       - name: durationType
 *         in: body
 *         description: Duration type (e.g., days, month, year)
 *         required: false
 *         schema:
 *           type: string
 *           enum: [days, month, year]
 *       - name: durationValue
 *         in: body
 *         description: Duration value (number)
 *         required: false
 *         schema:
 *           type: integer
 *       - name: status
 *         in: body
 *         description: Status of the plan (active/inactive)
 *         required: false
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Plan updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Plan not found
 *       500:
 *         description: Error updating plan
 */

router.put('/plan/:id', authenticate, updatePlan);


module.exports = router;

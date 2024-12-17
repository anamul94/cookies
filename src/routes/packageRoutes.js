const express = require("express");
const router = express.Router();
const {
  createPackage,
  getPackageById,
  getPackagesByProductId: getPackagesByProductId,
  updatePlan,
  getAllPackagesWithPagination,
} = require("../controllers/packageController");
const { authenticate } = require("../middlewares/authMiddleware");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

/**
 * @swagger
 * /packages/:
 *   post:
 *     summary: Create a new package
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - priceInBdt
 *               - priceInUsd
 *               - productID
 *               - durationType
 *               - durationValue
 *               - status
 *               - image
 *               - packageType
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the package
 *               priceInBdt:
 *                 type: number
 *                 description: Price of the package in BDT
 *               priceInUsd:
 *                 type: number
 *                 description: Price of the package in USD
 *               productID:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs of the products associated with the package
 *                 example: ["1", "2", "3"]
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
 *                 description: Status of the package (active, inactive)
 *                 enum:
 *                   - active
 *                   - inactive
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image of the package
 *               packageType:
 *                 type: string
 *                 description: Type of the package (regular, trial)
 *                 enum:
 *                   - regular
 *                   - trial
 *     responses:
 *       201:
 *         description: Package created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", authenticate, upload.single("image"), createPackage);

/**
 * @swagger
 * /packages/search:
 *   post:
 *     summary: Get all available packages
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page:
 *                 type: integer
 *                 description: Page number
 *                 example: 1
 *               limit:
 *                 type: integer
 *                 description: Number of items per page
 *                 example: 10
 *               title:
 *                 type: string
 *                 description: Title of the package
 *                 example: Package Three
 *               status:
 *                 type: string
 *                 description: Status of the package
 *                 example: active
 *     responses:
 *       200:
 *         description: Successfully retrieved a list of packages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: Title of the package
 *                     example: Package Three
 *                   price:
 *                     type: number
 *                     description: Price of the package
 *                     example: 330
 *                   productID:
 *                     type: string
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

router.post("/search", getAllPackagesWithPagination);

// Route to get plan by ID
/**
 * @swagger
 * /packages/{id}:
 *   get:
 *     summary: Get a package by ID
 *     tags: [Packages]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the package to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested package
 *       404:
 *         description: Package not found
 *       500:
 *         description: Error fetching package
 */

router.get("/:id", getPackageById);

// Route to get packages by Product ID
/**
 * @swagger
 * /packages/product/{productId}:
 *   get:
 *     summary: Get all packages by Product ID
 *     tags: [Packages]
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
 *         description: List of packages for the product
 *       404:
 *         description: No packages found
 *       500:
 *         description: Error fetching packages
 */

router.get("/packages/product/:productId", getPackagesByProductId);

// Route to update a plan by ID
/**
 * @swagger
 * /packages/{id}:
 *   put:
 *     summary: Update a package by ID
 *     tags: [Packages]
 *     security:
 *       - BearerAuth: [] # JWT token
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the package to update
 *         schema:
 *           type: integer
 *       - name: title
 *         in: body
 *         description: Title of the package
 *         required: false
 *         schema:
 *           type: string
 *       - name: price
 *         in: body
 *         description: Price of the package
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
 *         description: Status of the package (active/inactive)
 *         required: false
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Package updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Package not found
 *       500:
 *         description: Error updating package
 */

router.put("/:id", updatePlan);

module.exports = router;

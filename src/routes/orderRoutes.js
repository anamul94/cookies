const express = require('express');
const router = express.Router();
const {
  createOrder,
  getActiveOrdersByEmail,
  getActiveProductsByCustomerEmail,
  createTrialOrder,
  getOrderById,
  updateOrder,
  searchOrdersWithPagination,
  searchTrialOrdersWithPagination,
  updateTrialOrderStatus,
} = require("../controllers/orderController"); 
const multer = require("multer");
const { authenticate } = require('../middlewares/authMiddleware');
const upload = multer({ dest: "uploads/" });

// Create a new order for a customer
router.post('/create', createOrder);

// Create a new trial order for a customer
router.post('/createTrialOrder', upload.single('image'), createTrialOrder);

router.put(
  "/update-trial-order-status/:id",
  authenticate,
  updateTrialOrderStatus
);

// Get an order by ID
router.get('/:id', getOrderById);

// Update an order's status or email
router.put('/:id', updateOrder);

// Update a trial order's status

// Search for orders with pagination
router.post('/search', searchOrdersWithPagination);

// Search for trial orders with pagination
router.post("/search-trial-order", searchTrialOrdersWithPagination);

module.exports = router;

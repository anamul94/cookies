const express = require("express");
const router = express.Router();
const {
  createOrder,
  getActiveOrdersByEmail,
  getActiveOrderByCustomerEmail,
  createTrialOrder,
  getOrderById,
  updateOrder,
  searchOrdersWithPagination,
  searchTrialOrdersWithPagination,
  updateTrialOrderStatus,
} = require("../controllers/orderController");
const multer = require("multer");
const { authenticate } = require("../middleware/authMiddleware");
const upload = multer({ dest: "uploads/" });
const { customerAuth } = require("../middleware/customerAuthMiddleware");

// 1. Specific POST routes
router.post("/create", createOrder);
router.post("/createTrialOrder", upload.single("image"), createTrialOrder);
router.post(
  "/getActiveOrderByCustomerEmail",
  customerAuth,
  getActiveOrderByCustomerEmail
);
router.post("/search", searchOrdersWithPagination);
router.post("/search-trial-order", searchTrialOrdersWithPagination);

// 2. Specific PUT routes
router.put(
  "/update-trial-order-status/:id",
  authenticate,
  updateTrialOrderStatus
);
router.put("/:id", updateOrder);

// 3. Specific GET routes
router.get("/:id", getOrderById);

module.exports = router;

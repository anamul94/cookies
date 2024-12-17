const express = require('express');
const router = express.Router();
const trialOrderController = require('../controllers/orderController');

router.post('/', trialOrderController.createTrialOrder);

module.exports = router;
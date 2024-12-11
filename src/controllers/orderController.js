const express = require('express');
const { Order } = require('../models/Order');
const { Plan } = require('../models/Plan');
const { calculateEndDate } = require('../utils/calculateEndDate');
const Status = require("../enums/Status"); // Status Enum

const router = express.Router();

// POST: Create Order
exports.createOrder =  async (req, res) => {
    const { customerEmail, planId, startDate, durationType, durationValue } = req.body;

    try {
        // Check if the plan exists and if it's active
        // const plan = await Plan.findOne({ where: { id: planId } });

        // if (!plan || plan.status !== Status.ACTIVE) {
        //     return res.status(404).json({ message: 'Plan not found or is inactive' });
        // }

        // Calculate the end date based on the duration type and value
        const calculatedEndDate = calculateEndDate(durationType, durationValue, new Date(startDate));

        // Create the order
        const order = await Order.create({
            customerEmail,
            planId,
            startDate,
            endDate: calculatedEndDate,
            status: Status.ACTIVE, // Default to active
        });

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating order', error });
    }
};


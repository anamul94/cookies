const Order = require('../models/Order');
const  Plan  = require('../models/Plan');
const { calculateEndDate } = require("../utils/endDateCalculation")
const Status = require("../enums/Status"); // Status Enum
const OrderStatus = require('../enums/OrderStatus');
const { Op } = require('sequelize'); // Import Sequelize operators
const Product = require('../models/Product');


// POST: Create Order
exports.createOrder =  async (req, res) => {
   console.log("Order ctrl");
    const { customerEmail, planId, startDate, durationType, durationValue } = req.body;

    try {
        const plan = await Plan.findOne({ where: { id: planId, status: Status.ACTIVE } });
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found or is inactive' });
        }

        // Check for any active orders for the same plan and customer
        const activeOrder = await Order.findOne({
            where: {
                customerEmail,
                planId,
                status: {
                    [Op.or]: [OrderStatus.ACTIVE, OrderStatus.PROCESSING], // Check for either 'active' or 'processing'
                },
            },
        });


        if (activeOrder) {
            return res.status(400).json({
                message: `An ${activeOrder.status} order for this plan already exists for the specified customer.`,
            });
        }

        // Calculate the end date based on the duration type and value
        const calculatedEndDate = calculateEndDate(durationType, durationValue, new Date(startDate));

        console.log(await plan);
        // Create the order
        const order = await Order.create({
            customerEmail: customerEmail,
            planId: planId,
            productId: plan.productID,
            startDate: startDate,
            endDate: calculatedEndDate,
            status: OrderStatus.PROCESSING,
            // Default to active
        });

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating order', error });
    }
};


exports.getActiveOrdersByEmail = async (req, res) => {
    const { customerEmail } = req.query; // Assuming email is passed as a query parameter

    try {
        // Validate the email
        if (!customerEmail) {
            return res.status(400).json({ message: 'Customer email is required' });
        }

        // Find all active orders for the given email
        const activeOrders = await Order.findAll({
            where: {
                customerEmail,
                status: OrderStatus.PROCESSING,
            },
        });

        // Return the active orders
        if (activeOrders.length === 0) {
            return res.status(404).json({ message: 'No active orders found for this email' });
        }

        return res.status(200).json({ message: 'Active orders retrieved successfully', orders: activeOrders });
    } catch (error) {
        console.error('Error retrieving active orders:', error);
        return res.status(500).json({ message: 'Error retrieving active orders', error: error.message });
    }
};



exports.getActiveProductsByCustomerEmail = async (req, res) => {
    try {
        const { customerEmail } = req.query;

        // Validate customer email
        if (!customerEmail) {
            return res.status(400).json({ message: 'Customer email is required' });
        }

        // Fetch active orders for the customer
        const activeOrders = await Order.findAll({
            where: {
                customerEmail,
                status: OrderStatus.PROCESSING,
                endDate: {
                    [Op.gt]: new Date(), // Ensure the end date is in the future
                },
            },
            // include: [
            //     {
            //         model: Product, // Correctly associate the Product model
            //         as: 'product', // Use the alias defined in the association
            //         attributes: ['title', 'url', 'cookie'], // Fetch specific product fields
            //     },
            // ],
        });
        console.log(activeOrders);
        // Check if no active orders were found
        if (!activeOrders.length) {
            return res.status(404).json({ message: 'No active orders found for the customer' });
        }

        
        const productIds = activeOrders.map(order => order.productId);

        // Fetch product details for the extracted product IDs
        const products = await Product.findAll({
            where: {
                id: {
                    [Op.in]: productIds,
                },
            },
            attributes: ['id', 'title', 'url', 'cookie'], // Fetch specific product fields
        });

        // Map product details to orders
        const productMap = products.reduce((map, product) => {
            map[product.id] = product; // Map product by its ID for easy lookup
            return map;
        }, {});

        // Construct the response
        const response = activeOrders.map(order => {
            const product = productMap[order.productId];
            if (!product) {
                return {
                    error: `Product information is missing for order ID ${order.id}`,
                };
            }

            const remainingDays = Math.ceil((new Date(order.endDate) - new Date()) / (1000 * 60 * 60 * 24));
            return {
                productTitle: product.title,
                productUrl: product.url,
                productCookie: product.cookie,
                remainingDays,
            };
        });

        // Return the active products
        res.status(200).json({ activeProducts: response });
    } catch (error) {
        console.error('Error fetching active products:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};



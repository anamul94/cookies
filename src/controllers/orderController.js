const Order = require('../models/Order');
const { calculateEndDate } = require("../utils/endDateCalculation")
const Status = require("../enums/Status"); // Status Enum
const OrderStatus = require('../enums/OrderStatus');
const { Op } = require('sequelize'); // Import Sequelize operators
const Product = require('../models/Product');
const { broadcastToClient } = require("../websocket/websocket");
const Package = require('../models/Package');
const TrialOrder = require('../models/TrialOrder');
const { sendMail } = require('../utils/mailsender');
const { createCustomer , checkUseExists} = require("../servicees/customerService")
const imagekit = require("../utils/imageKit")
const fs = require('fs');
const path = require("path");
const TrialOrderStatus = require('../enums/TrialOrderStatus');


// POST: Create Order
exports.createOrder = async (req, res) => {
    console.log("Order ctrl",req.body);
    const { customerEmail, planIds, startDate, durationType, phoneNumber, transactionNumber } = req.body;

    try {
        const plans = await Package.findAll({ where: { id: planIds, status: Status.ACTIVE } });
        if (!plans || plans.length !== planIds.length) {
            return res.status(404).json({ message: 'Plan not found or is inactive' });
        }

        console.log(plans);

        const orders = [];

        for (const plan of plans) {
            const activeOrder = await Order.findOne({
                where: {
                    customerEmail,
                    planId: plan.id,
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
            const calculatedEndDate = calculateEndDate(plan.durationType, plan.durationValue, new Date(startDate));

            // Create the order
            const order = await Order.create({
                customerEmail: customerEmail,
                planId: plan.id,
                productId: plan.productId,
                startDate: startDate,
                endDate: calculatedEndDate,
                status: OrderStatus.PROCESSING,
                phoneNumber: phoneNumber,
                transactionNumber: transactionNumber,
                // Default to active
            });

            orders.push(order);

        }

        
        res.status(201).json({ message: 'Order created successfully', orders });
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
        const { customerEmail, mac } = req.query;
        console.log(req.query)

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
        // console.log(activeOrders);
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
        const websocketResponse = { customerEmail, mac };
        console.log(mac)
        res.status(200).json({ activeProducts: response });
        broadcastToClient(customerEmail, websocketResponse);


    } catch (error) {
        console.error('Error fetching active products:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.createTrialOrder = async (req, res) => {
    try {
        const { name, customerEmail,  phoneNumber, facebookId  } = req.body;
        console.log(req.body);
       const isTrialOrder = await TrialOrder.findOne({ where: { customerEmail } });
        if (isTrialOrder) {
            return res.status(400).json({ message: 'Trial order already exists for this customer' });
        }
        if(!req.file){
            return res.status(400).json({ message: 'Please upload a file' });
        }
        const filePath = req.file.path;
        const fileName = customerEmail + "_" + req.file.originalname;

        // Upload file to ImageKit
        let uploadedFile;
        try {
            uploadedFile = await imagekit.upload({
                file: fs.readFileSync(filePath),
                fileName,
            });

            console.log("Uploaded File URL:", uploadedFile.url);
        } catch (uploadError) {
            console.error("Error uploading file to ImageKit:", uploadError);
            return res.status(500).json({ message: "Error uploading file to ImageKit", error: uploadError });
        } finally {
            // Clean up local file after upload
            fs.unlink(filePath, (err) => {
                if (err) console.error("Error deleting temporary file:", err);
            });
        }


        const isCustomer = await checkUseExists(customerEmail);
        if (!isCustomer) {
           const customer = await createCustomer(customerEmail,name, phoneNumber, facebookId);
           sendMail(customerEmail, "Your password", customer.password);
        }
        
        const trialOrder = await TrialOrder.create({
            name,
            customerEmail,
            screenShotImageId: uploadedFile.fileId,
            screenShotUrl: uploadedFile.url,
            facebookId: facebookId,
            status: TrialOrderStatus.PENDING, // Explicitly assign status
        });
        res.status(201).json({ message: 'Trial order created successfully', trialOrder });


    }
    catch (error) {
        console.error('Error creating trial order:', error);
        res.status(500).json({ message: 'Error creating trial order', error });
    }
}


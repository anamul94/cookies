const Order = require('../models/Order');
const { calculateEndDate } = require("../utils/endDateCalculation")
const Status = require("../enums/Status"); // Status Enum
const OrderStatus = require('../enums/OrderStatus');
const { Op, or } = require('sequelize'); // Import Sequelize operators
const Product = require('../models/Product');
const { broadcastToClient } = require("../websocket/websocket");
const Package = require('../models/Package');
const TrialOrder = require('../models/TrialOrder');
const { sendMail } = require('../utils/mailsender');
const { createCustomer, checkUseExists } = require("../servicees/customerService")
const imagekit = require("../utils/imageKit")
const fs = require('fs');
const path = require("path");
const TrialOrderStatus = require('../enums/TrialOrderStatus');
const OrderItems = require('../models/OrderItems'); // Import OrderItems model
const { default: PackageOrderType } = require('../enums/PackageOrderType.enum');


// POST: Create Order
exports.createOrder = async (req, res) => {
    console.log("Order ctrl", req.body);
    const { customerEmail, customerName, planIds, phoneNumber, transactionNumber, paymentMethod } = req.body;

    try {
        const plans = await Package.findAll({ where: { id: planIds, status: Status.ACTIVE } });
        if (!plans || plans.length !== planIds.length) {
            return res.status(404).json({ message: 'Plan not found or is inactive' });
        }

        // Check for existing active orders for any of the plans
        const existingOrders = await Order.findOne({
            where: {
                customerEmail,
                status: {
                    [Op.or]: [OrderStatus.ACTIVE, OrderStatus.PROCESSING],
                },
            }
        });

        if (existingOrders) {
            return res.status(400).json({
                message: `An active or processing order already exists for this customer.`,
            });
        }

        const isCustomerExists = await checkUseExists(customerEmail);
        if (!isCustomerExists) {
            const customer = await createCustomer(customerEmail, customerName, phoneNumber);
            sendMail(customerEmail, "Your password", customer.password);
        }

        const orderItemIds = [];
        const startDate = new Date();
        let totalPriceInBdt = 0;
        let totalPriceInUsd = 0;

        console.log("plans", plans);

        // Create OrderItems for each plan
        for (const plan of plans) {
            console.log("Plan", plan.productID);
            const productIds = plan.productID.split(",").map(Number);
            console.log("productIds", productIds);
            for (const productId of productIds) {
                const orderItems = await OrderItems.create({
                    productId: productId,
                    startDate: startDate,
                    endDate: calculateEndDate(plan.durationType, plan.durationValue, startDate),
                    packageId: plan.id
                });
                orderItemIds.push(orderItems.id);
                totalPriceInBdt += plan.priceInBdt;
                totalPriceInUsd += plan.priceInUsd;
            }
        }

        // Create main order with all OrderItems
        const order = await Order.create({
            customerEmail: customerEmail,
            status: OrderStatus.PROCESSING,
            phoneNumber: phoneNumber,
            transactionNumber: transactionNumber,
            paymentMethod: paymentMethod,
            OrderItems: orderItemIds,
            orderType: PackageOrderType.REGULAR 
        });

        res.status(201).json({ 
            message: 'Order placed successfully', 
            orderId: order.id,
            orderItems: orderItemIds,
        });
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
   console.log("Trial order ctrl", req.body);
    try {
        const { name, customerEmail, phoneNumber, facebookId, packageId } = req.body;
        console.log(req.body);
        const isTrialOrder = await TrialOrder.findOne({ where: { customerEmail } });
        if (isTrialOrder) {
            return res.status(400).json({ message: 'Trial order already exists for this customer' });
        }
        if (!req.file) {
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
            const customer = await createCustomer(customerEmail, name, phoneNumber, facebookId);
            sendMail(customerEmail, "Your password", customer.password);
        }

        const package = await Package.findByPk(packageId);
        if (!package) {
            return res.status(404).json({ message: 'Package not found' });
        }
        const orderItemIds = [];
        const productIds = package.productID.split(",").map(Number);
        for (const productId of productIds) {
            const orderItem = await OrderItems.create({
                productId: productId,
                startDate: new Date(),
                endDate: calculateEndDate(package.durationType, package.durationValue, new Date()),
                packageId: packageId
            });
            orderItemIds.push(orderItem.id);
        }
        const order = await Order.create({
            customerEmail: customerEmail,
            status: OrderStatus.PROCESSING,
            phoneNumber: phoneNumber,
            transactionNumber: "Trial",
            paymentMethod:PackageOrderType.OTHER,
            OrderItems: orderItemIds,
            orderType: PackageOrderType.TRIAL 
        });
        
         const trialOrder = await TrialOrder.create({
           name,
           customerEmail,
           screenShotImageId: uploadedFile.fileId,
           screenShotUrl: uploadedFile.url,
           facebookId: facebookId,
           status: OrderStatus.PROCESSING,
           orderId: order.id
         });
        res.status(201).json({ message: 'Trial order created successfully', trialOrder });


    }
    catch (error) {
        console.error('Error creating trial order:', error);
        res.status(500).json({ message: 'Error creating trial order', error });
    }
}

exports.searchOrdersWithPagination = async (req, res) => {
   console.log("search order ctrl", req.body);
    try {
        const { page = 1, limit = 10, customerEmail, status } = req.body;
        const offset = (page - 1) * limit;

        // Create a dynamic filter object
        let filter = {};

        // Only add customerEmail filter if it's provided
        if (customerEmail) {
            filter.customerEmail = customerEmail;
        }

        // Only add status filter if it's provided, case-insensitive comparison
        if (status) {
            filter.status =status;
        }

        console.log(status, customerEmail);

        // Query the database with dynamic filter
        const { count, rows: orders } = await Order.findAndCountAll({
            where: filter,
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        console.log("orders", orders);

        res.status(200).json({
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            orders,
        });
    } catch (error) {
        console.error('Error searching orders:', error);
        res.status(500).json({ message: 'Error searching orders', error });
    }
};


exports.getOrderById = async (req, res) => {
    try {
        console.log("Request params:", req.params);
        const { id } = req.params;  // Changed from orderId to id to match route parameter
        
        const order = await Order.findOne({ 
            where: { id: parseInt(id) }  // Parse id to integer
        });
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        const products = await OrderItems.findAll({ 
            where: { id: order.OrderItems }      
        }); 
        order.OrderItems = products;
        
        res.status(200).json({ order });
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        res.status(500).json({ message: 'Error fetching order', error });
    }
};

exports.updateOrder = async (req, res) => {
    try {
       console.log('update order', req.body);
        const { id } = req.params;
        const { customerEmail, status } = req.body;
        console.log('update order', req.body);
        // Find the order by primary key
        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update fields only if they are defined and not null
        if (customerEmail !== undefined && customerEmail !== null) {
            order.customerEmail = customerEmail;
        }

        if (status !== undefined && status !== null) {
            order.status = status;
        }

        // Save the updated order
        await order.save();

        res.status(200).json({ message: 'Order updated successfully', order });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Error updating order', error });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByPk(id);
        res.status(200).json({ order });
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        res.status(500).json({ message: 'Error fetching order', error });
    }
};

exports.updateTrialOrderStatus = async (req, res) => {
    console.log("update trial order status ctrl", req.body);
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Find the trial order by primary key
        const trialOrder = await TrialOrder.findByPk(id);

        if (!trialOrder) {
            return res.status(404).json({ message: 'Trial order not found' });
        }

        // Update the trial order status
        trialOrder.status = status;
        await trialOrder.save();

        // Find the associated order by the orderId in the trial order
        const order = await Order.findByPk(trialOrder.orderId);

        if (order) {
            // Update the order status
            order.status = status;
            await order.save();
        }

        res.status(200).json({ message: 'Trial order and order status updated successfully', trialOrder });
    } catch (error) {
        console.error('Error updating trial order and order status:', error);
        res.status(500).json({ message: 'Error updating trial order and order status', error });
    }
};

exports.searchTrialOrdersWithPagination = async (req, res) => {
    const { page = 1, limit = 10, status, customerEmail     } = req.body;
    const offset = (page - 1) * limit;
    const where = {};
    if (status) {
        where.status = status;
    }
    if (customerEmail) {
        where.customerEmail = customerEmail;
    }
    const {count, rows: trialOrders} = await TrialOrder.findAndCountAll({ limit, offset, where });
    res.status(200).json({ total: count, page: parseInt(page), limit: parseInt(limit), trialOrders });
};
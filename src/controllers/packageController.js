const DurationTypes = require('../enums/DurationTypes');
const Status = require('../enums/Status');
const Package = require('../models/Package');
const Product = require('../models/Product');
const { Op } = require('sequelize'); // Import Sequelize operators


exports.createPackage = async (req, res) => {
    try {
        const { title, price, productID, durationType, durationValue, status } = req.body;

        // Validate durationType against DurationTypes enum
        if (!Object.values(DurationTypes).includes(durationType)) {
            return res.status(400).json({ message: 'Invalid duration type' });
        }

        // Validate status against Status enum (optional input)
        if (status && !Object.values(Status).includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        // Create the new plan
        const newPlan = await Package.create({
            title,
            price,
            productID,
            durationType,
            durationValue,
            status: status || Status.ACTIVE, // Default to 'active' if no status is provided
        });

        res.status(201).json({ message: 'Plan created successfully', plan: newPlan });
    } catch (error) {
        console.error('Error creating plan:', error);
        res.status(500).json({ message: 'Error creating plan', error });
    }
};

exports.getAllPackages = async(req, res) => {
   console.log("get all packages")
    const packages = await Package.findAll();
    return res.status(200).json(packages);
}

// Get Plan by ID
exports.getPlanById = async (req, res) => {
    const { id } = req.params; // Extract Plan ID from the request parameters
    try {
        // Fetch the plan by its primary key
        const plan = await Package.findByPk(id);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        // Fetch the products associated with the plan
        const products = await Product.findAll({
            where: {
                id: {
                    [Op.in]: plan.productID // Use Sequelize's $in operator for matching
                }
            },
            attributes: ['id', 'title', 'status'] // Select only id, title, and status fields
        });

        console.log(products);
        const productsResp = [];
       
        // Construct the response object
        const response = {
            id: plan.id,
            title: plan.title,
            price: plan.price,
            durationType: plan.durationType,
            durationValue: plan.durationValue,
            status: plan.status,
            createdAt: plan.createdAt,
            updatedAt: plan.updatedAt,
            products // Include the products array instead of productID
        };

        // Send the response
        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching plan:", error.message);
        res.status(500).json({ message: 'Error fetching plan', error });
    }
};


// Get Plans by Product ID
exports.getPlansByProductId = async (req, res) => {
    const { productId } = req.params; // Extract Product ID from the request parameters
    try {
        const plans = await Package.findAll({ where: { productID: productId } }); // Find all plans associated with the Product ID
        if (!plans || plans.length === 0) {
            return res.status(404).json({ message: 'No plans found for the specified product' });
        }
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching plans', error });
    }
};

// Update Plan by ID
exports.updatePlan = async (req, res) => {
    const { id } = req.params; // Extract Plan ID from the request parameters
    const { title, price, productID, durationType, durationValue, status } = req.body;

    try {
        // Find the plan by its primary key
        const plan = await Package.findByPk(id);

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        // Update the plan with the provided data
        plan.title = title || plan.title;
        plan.price = price || plan.price;
        plan.productID = productID || plan.productID;
        plan.durationType = durationType || plan.durationType;
        plan.durationValue = durationValue || plan.durationValue;
        plan.status = status || plan.status;

        // Save the updated plan
        await plan.save();

        res.status(200).json({ message: 'Plan updated successfully', plan });
    } catch (error) {
        res.status(500).json({ message: 'Error updating plan', error });
    }
};

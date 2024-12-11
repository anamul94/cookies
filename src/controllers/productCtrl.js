const { Op } = require('sequelize'); // Sequelize Operators
const { Product } = require('../models/Product');

exports.createProduct = async (req, res) => {
    try {
        const { title, url, cookie, status } = req.body;

        // Ensure required fields are provided
        if (!title || !url || !cookie) {
            return res.status(400).json({ message: 'Title, URL, and cookie are required' });
        }

        // The user ID is extracted from the JWT by the middleware
        const createdBy = req.user.id;

        // Create the product
        const product = await Product.create({
            title,
            url,
            cookie,
            status: status || 'active', // Default to 'active' if not provided
            createdBy,
        });

        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product', error });
    }
};


exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params; // Extract the ID from the request parameters

        // Find the product by ID
        const product = await Product.findByPk(id);

        // If no product is found, return a 404 response
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Return the found product
        res.status(200).json({ product });
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ message: 'Error fetching product', error });
    }
};


exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params; // Extract product ID from request parameters
        const { title, url, cookie, status } = req.body; // Extract fields to update from the request body

        // Find the product by ID
        const product = await Product.findByPk(id);

        // If the product doesn't exist, return a 404 error
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update the product with the provided data
        await product.update({
            title: title || product.title, // Keep existing value if not provided
            url: url || product.url,
            cookie: cookie || product.cookie,
            status: status || product.status,
        });

        // Return the updated product
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error });
    }
};



exports.searchProducts = async (req, res) => {
    try {
        const { title, status, page = 1, limit = 10 } = req.body;

        // Build the where clause based on query parameters
        const whereClause = {};
        if (title) {
            whereClause.title = { [Op.like]: `%${title}%` }; // Search by title (case-insensitive, partial match)
        }
        if (status) {
            whereClause.status = status; // Search by status (exact match)
        }

        // Calculate pagination offset
        const offset = (page - 1) * limit;

        // Fetch products with pagination
        const { count, rows: products } = await Product.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        // Return the results with pagination info
        res.status(200).json({
            total: count, // Total number of matching products
            page: parseInt(page), // Current page
            limit: parseInt(limit), // Number of items per page
            products, // The matching products
        });
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Error searching products', error });
    }
};


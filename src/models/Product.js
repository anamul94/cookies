const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming your database connection is in `config/db.js`
const User = require('./User');
const Status = require("../enums/Status");

// Enum for status


const Product = sequelize.define('Product', {
    title: {
        type: DataTypes.STRING(255), // Title with a maximum length of 255
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING(300), // URL with a maximum length of 2083 (standard max URL length)
        allowNull: false,
    },
    cookie: {
        type: DataTypes.JSON, // JSON object to store cookie data
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(Object.values(Status)), // Enum with 'active' and 'inactive'
        defaultValue: Status.ACTIVE, // Default status is 'active'
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Reference the User model
            key: 'id',   // Reference the 'id' field in the User table
        },
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = { Product, Status };

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Sequelize instance
const Plan = require('./Plan'); // Plan model
const OrderStatus = require('../enums/OrderStatus');

const Order = sequelize.define('Order', {
    customerEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true, // Ensures it's a valid email
        },
    },
    planId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Plan,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(...Object.values(OrderStatus)),
        defaultValue: OrderStatus.ACTIVE, // Default to 'active'
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = Order;

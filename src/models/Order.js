const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Sequelize instance
const Plan = require('./Plan'); // Plan model
const OrderStatus = require('../enums/OrderStatus');
const  Product  = require('./Product');

const Order = sequelize.define('Order', {
    customerEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        },
        indexes: [{ unique: false }]
    },
    planId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM(...Object.values(OrderStatus)),
        defaultValue: OrderStatus.ACTIVE
    }
}, {
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: [ 'status'] }
    ]
});

module.exports = Order;

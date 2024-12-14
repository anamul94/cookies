const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Sequelize instance
const Plan = require('./Package'); // Plan model
const OrderStatus = require('../enums/OrderStatus');
const Product = require('./Product');
const PaymentMethods = require('../enums/PaymentMethos.enum');
const OrderItems = require('./OrderItems');

const Order = sequelize.define('Order', {
    customerEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        },
        indexes: [{ unique: false }]
    },
    status: {
        type: DataTypes.ENUM(...Object.values(OrderStatus)),
        defaultValue: OrderStatus.ACTIVE
    },
    phoneNumber: {
        type: DataTypes.STRING(20),
    },
    transactionNumber: {
        type: DataTypes.STRING(30),
    },
    paymentMethod: {
        type: DataTypes.ENUM(...Object.values(PaymentMethods)),
    },

    OrderItems: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
}, {
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['status'] }
    ]
});


module.exports = Order;

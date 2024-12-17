const {  DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const OrderStatus = require('../enums/OrderStatus');


const TrialOrder = sequelize.define('TrialOrder', {
    customerEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        },
        indexes: [{ unique: false }]
    },

    facebookId: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    screenShotImageId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    screenShotUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
   
   status: {
        type: DataTypes.ENUM(...Object.values(OrderStatus)),
        allowNull: false,
        defaultValue: OrderStatus.PROCESSING,
    },
   orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
   
});

module.exports = TrialOrder;
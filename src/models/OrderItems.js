const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderItems = sequelize.define('OrderItems', {
    
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'id',
        },
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    packageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Packages',
            key: 'id',
        },
    },

}, {
    timestamps: false,
});

module.exports = OrderItems;



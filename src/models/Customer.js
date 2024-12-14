const sequelize = require('../config/db'); // Sequelize instance
const { DataTypes } = require('sequelize');

const Customer = sequelize.define('Customer', {
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    facebookId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
   
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['email']
        },
    ],
});

module.exports = Customer;
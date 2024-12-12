const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('Users', {
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
    },
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['email']
        },
        // Optional: if you frequently search by username
        {
            unique: false,
            fields: ['username']
        }
    ],
    // Prevent Sequelize from creating too many automatic indexes
    hooks: {
        beforeDefine: (attributes, options) => {
            options.indexes = options.indexes || [];
        }
    }
});

module.exports = User;

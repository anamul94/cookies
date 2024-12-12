const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Your Sequelize instance
const DurationTypes = require('../enums/DurationTypes'); // Import the DurationTypes enum
const Status = require("../enums/Status");
const  Product  = require('./Product');


const Plan = sequelize.define('Plan', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    productID: {
        type: DataTypes.INTEGER,
        allowNull: false,
       
    },
    durationType: {
        type: DataTypes.ENUM(...Object.values(DurationTypes)), // Spread values from the enum
        allowNull: false,
    },
    durationValue: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
        },
    },
    status: {
        type: DataTypes.ENUM(Object.values(Status)), // Enum with 'active' and 'inactive'
        defaultValue: Status.ACTIVE, // Default status is 'active'
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});



module.exports = Plan;

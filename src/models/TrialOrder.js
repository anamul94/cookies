const {  DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const TrialOrderStatus = require('../enums/TrialOrderStatus');  


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
        type: DataTypes.ENUM(...Object.values(TrialOrderStatus)),
        allowNull: false,
        defaultValue: TrialOrderStatus.PENDING,
    },
}, {
    timestamps: true,
   
});

module.exports = TrialOrder;
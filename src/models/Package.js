const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Package = sequelize.define('Package', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  priceInBdt: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  priceInUsd: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  productID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  durationType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  durationValue: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  },
  imageId: {
    type: DataTypes.STRING
  },
  imageUrl: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'Packages',
  timestamps: true
});

module.exports = Package;

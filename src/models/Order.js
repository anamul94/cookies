// Order.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const OrderStatus = require("../enums/OrderStatus");
const PaymentMethods = require("../enums/PaymentMethos.enum");
const { default: PackageOrderType } = require("../enums/PackageOrderType.enum");

const Order = sequelize.define(
  "Order",
  {
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      indexes: [{ unique: false }],
    },
    status: {
      type: DataTypes.ENUM(...Object.values(OrderStatus)),
      defaultValue: OrderStatus.ACTIVE,
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
    // orderItems: {
    //   type: DataTypes.JSON,
    //   allowNull: false,
    //   defaultValue: [],
    // },
    totalPriceInBdt: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    totalPriceInUsd: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    orderType: {
      type: DataTypes.ENUM(...Object.values(PackageOrderType)),
      allowNull: false,
      defaultValue: PackageOrderType.REGULAR,
    },
  },
  {
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ["status"] }],
  }
);

module.exports = Order;

Order.sync({ alter: true });

// OrderItems.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const OrderStatus = require("../enums/OrderStatus");
const Product = require("./Product");
const Package = require("./Package");

const OrderItems = sequelize.define(
  "OrderItems",
  {
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    packageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Packages",
        key: "id",
      },
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "orders",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(OrderStatus )),
      defaultValue: OrderStatus.PROCESSING,
    },
  },
  {
    timestamps: false,
  }
);
OrderItems.belongsTo(Product, { foreignKey: "productId", as: "product" });
OrderItems.belongsTo(Package, { foreignKey: "packageId", as: "package" });

module.exports = OrderItems;

// OrderItems.sync({ alter: true });
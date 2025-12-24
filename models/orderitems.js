const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const OrderItem = sequelize.define("order_items", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  food_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }
});

module.exports = OrderItem;

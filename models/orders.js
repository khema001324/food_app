const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Orders = sequelize.define("orders", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: "pending"   // pending | placed | cancelled | completed
  }
});

module.exports = Orders;

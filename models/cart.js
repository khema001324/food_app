const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Cart = sequelize.define("cart", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  food_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  }
});

module.exports = Cart;

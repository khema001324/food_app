const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const FoodItem = sequelize.define("fooditems", {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  category: {
    type: DataTypes.STRING,
    allowNull: false
  },

  description: {
    type: DataTypes.STRING,
    allowNull: false
  },

  rating: {
    type: DataTypes.FLOAT,
    allowNull: true
  },

  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  foodImage: {
    type: DataTypes.STRING,
    allowNull: true
  }

});

module.exports = FoodItem;

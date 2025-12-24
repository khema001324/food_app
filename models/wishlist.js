const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");


const Wishlist = sequelize.define("Wishlist", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  food_id: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Wishlist;
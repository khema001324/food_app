const { DataTypes } = require("sequelize");
const {sequelize }= require("../config/db");

const user = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
    phone: {
    type: DataTypes.STRING,
    allowNull: true
  },

  address: {
    type: DataTypes.STRING,
    allowNull: true
  },

  profileImage: {
    type: DataTypes.STRING, // store file path
    allowNull: true
  },
  resetPasswordToken: {
    type :DataTypes.STRING,
    allowNull : true
  },

  resetPasswordExpires:{
    type: DataTypes.DATE,
    allowNull: true
  },


});

module.exports = user;


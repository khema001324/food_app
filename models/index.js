const { sequelize, createDatabaseIfNotExists } = require('../config/db');


const User = require('./user');
const FoodItems = require('./fooditems');
const Orders = require('./orders');
const OrderItem = require('./orderitems');
const Cart = require('./cart');
const Wishlist = require('./wishlist');

User.hasMany(FoodItems, {
  foreignKey: "created_by",
  as: "foodItems"
});


FoodItems.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator"
});


User.hasMany(Cart, { foreignKey: "user_id" });
Cart.belongsTo(User, { foreignKey: "user_id" });

FoodItems.hasMany(Cart, { foreignKey: "food_id" });
Cart.belongsTo(FoodItems, { foreignKey: "food_id" });

User.hasMany(Wishlist, { foreignKey: "user_id" });
Wishlist.belongsTo(User, { foreignKey: "user_id" });

FoodItems.hasMany(Wishlist, { foreignKey: "food_id" });
Wishlist.belongsTo(FoodItems, { foreignKey: "food_id" });

Orders.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Orders, { foreignKey: "order_id" });
OrderItem.belongsTo(FoodItems, { as: "fooditem", foreignKey: "food_id" });
User.hasMany(Orders, { foreignKey: "user_id" });
Orders.belongsTo(User, { foreignKey: "user_id" });


const initDatabase = async () => {
    try {
      // Creates the database if it doesn't exist
      await createDatabaseIfNotExists();
  
      // Sync all models  with the database and the models present in the code 
      await sequelize.sync({ alter: false });  //this {alter : true} will add newly added column to the table without dropping them 
  
      console.log('Database and tables created successfully!');
    } catch (error) {
      console.error('Error initializing the database:', error);
      throw error;
    }
  };

  module.exports = {
    sequelize,
    initDatabase,
    User,
    FoodItems,
    Orders,
    OrderItem,
    Cart,

  }
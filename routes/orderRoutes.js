const express = require("express");
const oderRouter = express.Router();
const orderController = require("../controllers/orderController");

oderRouter.post("/place", orderController.placeOrder);
oderRouter.get("/user/:user_id", orderController.getUserOrders);
// oderRouter.get("/all", orderController.getAllOrders); // Admin
oderRouter.get("/all", orderController.getAllOrders);
oderRouter.put("/update-status/:orderId", orderController.updateOrderStatus);

module.exports = oderRouter;

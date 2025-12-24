const express = require("express");
const cartRouter = express.Router();
const cartController = require("../controllers/cartControllers");

cartRouter.post("/add", cartController.addToCart);
cartRouter.get("/:user_id", cartController.getCartByUser);
cartRouter.put("/update", cartController.updateCartQuantity);
cartRouter.delete("/delete/:cart_id", cartController.deleteCartItem);

module.exports = cartRouter;

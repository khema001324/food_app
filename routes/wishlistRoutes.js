const express = require("express");
const wishlistrouter = express.Router();
const wishlistController = require("../controllers/wishlistController");

wishlistrouter.post("/addwishlist", wishlistController.addToWishlist);
wishlistrouter.get("/wishlist/:user_id", wishlistController.getUserWishlist);
wishlistrouter.delete("/wishlist/:id", wishlistController.removeFromWishlist);

module.exports = wishlistrouter;

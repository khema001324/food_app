const express = require("express");
const fooditemsrouter = express.Router();
const   fooditemsController = require("../controllers/fooditemsController");
const upload = require("../middleware/uploadFoodItemImage");

// ADD FOOD ITEM (with Image Upload)
fooditemsrouter.post("/add", upload.single("foodImage"), fooditemsController.addFoodItem);


fooditemsrouter.get("/all", fooditemsController.getAllFoodItems);

// GET SINGLE FOOD ITEM
fooditemsrouter.get("/:id", fooditemsController.getFoodItemById);

// UPDATE FOOD ITEM (with Image Upload)
fooditemsrouter.put("/update/:id", upload.single("foodImage"), fooditemsController.updateFoodItem);
// fooditemsrouter.put("/update/:id", upload.single("foodImage"), foodController.updateFoodItem);

fooditemsrouter.delete("/delete/:id", fooditemsController.deleteFoodItem);

module.exports = fooditemsrouter;

const Wishlist = require("../models/wishlist");
const FoodItem = require("../models/fooditems");

// Add item to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { user_id, food_id } = req.body;
    console.log(req.body,"-----------------------------")
    if (!user_id || !food_id) return res.status(400).json({ message: "Missing user_id or food_id" });

    const exists = await Wishlist.findOne({ where: { user_id, food_id } });
    if (exists) return res.status(400).json({ message: "Already in wishlist" });

    const item = await Wishlist.create({ user_id, food_id });
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get user's wishlist
const getUserWishlist = async (req, res) => {
  try {
    const { user_id } = req.params;
    const wishlist = await Wishlist.findAll({
      where: { user_id },
      include: [FoodItem]
    });
    res.json({ success: true, wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    await Wishlist.destroy({ where: { id } });
    res.json({ success: true, message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addToWishlist, getUserWishlist, removeFromWishlist };

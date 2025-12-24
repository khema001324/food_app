const Cart = require("../models/cart");
const FoodItem = require("../models/fooditems");

const addToCart = async (req, res) => {
  try {
    const { user_id, food_id, quantity } = req.body;

    const qty = parseInt(quantity) || 1;  

    const food = await FoodItem.findByPk(food_id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }

    const existingItem = await Cart.findOne({
      where: { user_id, food_id }
    });

    if (existingItem) {
      existingItem.quantity += qty;   
      await existingItem.save();

      return res.json({
        success: true,
        message: "Cart updated",
        item: existingItem
      });
    }

    const newItem = await Cart.create({
      user_id,
      food_id,
      quantity: qty  
    });

    res.json({
      success: true,
      message: "Item added to cart",
      item: newItem
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


   const getCartByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const cart = await Cart.findAll({
      where: { user_id },
      include: [FoodItem]  
    });

    res.json({ success: true, cart });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


  const updateCartQuantity = async (req, res) => {
  try {
    const { cart_id, quantity } = req.body;

    const item = await Cart.findByPk(cart_id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    item.quantity = quantity;
    await item.save();

    res.json({ success: true, message: "Quantity updated", item });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const  deleteCartItem = async (req, res) => {
  try {
    const { cart_id } = req.params;

    await Cart.destroy({ where: { id: cart_id } });

    res.json({ success: true, message: "Item removed from cart" });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports  = {
           addToCart,
           getCartByUser,
           updateCartQuantity,
           deleteCartItem,

}
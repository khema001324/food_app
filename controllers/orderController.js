const Orders = require("../models/orders");
const OrderItem = require("../models/orderitems");
const Cart = require("../models/cart");
const FoodItem = require("../models/fooditems");
const User = require('../models/user');



// const placeOrder = async (req, res) => {
//   try {
//     const { user_id } = req.body;

//     if (!user_id) {
//       return res.status(400).json({ success: false, message: "user_id required" });
//     }

   
//     const cartItems = await Cart.findAll({
//       where: { user_id },
//       include: [FoodItem]
//     });

//     if (cartItems.length === 0) {
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

 
//     let total = 0;
//     cartItems.forEach(item => {
//       total += item.quantity * item.FoodItem.price;
//     });

//     const order = await Orders.create({
//       user_id,
//       total_price: total,
//       status: "placed"
//     });

   
//     for (let item of cartItems) {
//       await OrderItem.create({
//         order_id: order.id,
//         food_id: item.food_id,
//         quantity: item.quantity,
//         price: item.FoodItem.price
//       });
//     }

 
//     await Cart.destroy({ where: { user_id } });

//     res.json({
//       success: true,
//       message: "Order placed successfully",
//       order_id: order.id
//     });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };



// GET ALL ORDERS FOR ONE USER

const placeOrder = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, message: "user_id required" });
    }

    const cartItems = await Cart.findAll({
      where: { user_id },
      include: [FoodItem]   // alias is auto -> fooditem
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    let total = 0;
    cartItems.forEach(item => {
      total += item.quantity * item.fooditem.price;
    });

    const order = await Orders.create({
      user_id,
      total_price: total,
      status: "pending"
    });

    for (let item of cartItems) {
      await OrderItem.create({
        order_id: order.id,
        food_id: item.food_id,
        quantity: item.quantity,
        price: item.fooditem.price
      });
    }

    await Cart.destroy({ where: { user_id } });

    res.json({
      success: true,
      message: "Order placed successfully",
      order_id: order.id
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// const getUserOrders = async (req, res) => {
//   try {
//     const { user_id } = req.params;

//     const orders = await Orders.findAll({
//       where: { user_id },
//       include: [OrderItem]
//     });
      
// //    const orders = await Orders.findAll({
// //   where: { user_id },
// //   include: [
// //     {
// //       model: OrderItem,
// //       as: "order_items",
// //       include: [FoodItem]     // includes food details also
// //     }
// //   ]
// // });

//     res.json({ success: true, orders });

//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };



const getUserOrders = async (req, res) => {
  try {
    const { user_id } = req.params;

    const orders = await Orders.findAll({
      where: { user_id },
      include: [
        {
          model: OrderItem,
          as: "order_items",
          include: [
            {
              model: FoodItem,
              as: "fooditem"
            }
          ]
        }
      ]
    });

    res.json({ success: true, orders });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// ADMIN: GET ALL ORDERS (show all users orders)
// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Orders.findAll({
//       include: [OrderItem]
//     });

//     res.json({
//       success: true,
//       orders
//     });

//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// const updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const { order_id } = req.params;

//     const order = await Orders.findByPk(order_id);
//     if (!order) return res.json({ success: false, message: "Order not found" });

//     order.status = status;
//     await order.save();

//     res.json({ success: true, message: "Status updated" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };



const getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"]
        },
        {
          model: OrderItem,
          include: [
            {
              model: FoodItem,
              as: "fooditem", 
              attributes: ["id", "name", "price", "foodImage"]
            }
          ]
        }
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body; // <-- make sure frontend sends { status: "placed" }

    const allowedStatus = ["placed", "pending", "success", "failed"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status!" });
    }

    const updated = await Orders.update(
      { status },
      { where: { id: orderId } }
    );

    if (updated[0] === 0) {
      return res.status(404).json({ message: "Order not found!" });
    }

    res.json({ success: true, message: "Order status updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating order status" });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
};

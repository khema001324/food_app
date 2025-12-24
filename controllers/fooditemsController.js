const FoodItem = require("../models/fooditems");

const fs = require("fs");
const path = require("path");


// const addFoodItem = async (req, res) => {
//   try {
//     const { name, price, category, description, rating, created_by } = req.body;

//     if (!name || !price || !category) {
//       return res.status(400).json({ success: false, message: "All fields required" });
//     }

//     const foodImage = req.file ? req.file.path : null;

//     const item = await FoodItem.create({
//       name,
//       price,
//       category,
//       description,
//       rating,
//       created_by,
//       foodImage
//     });

//     res.json({ success: true, message: "Food Item Added", item });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

const addFoodItem = async (req, res) => {
  try {
    const { name, price, category, description, rating, created_by } = req.body;

    console.log(req.body, "------------");

    if (!name || !price || !category || !created_by) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const foodImage = req.file ? req.file.filename : null;

    const item = await FoodItem.create({
      name,
      price,
      category,
      description,
      rating,
      created_by: parseInt(created_by), // 🔥 FIX HERE
      foodImage
    });
       console.log(item,"-------------item")
    res.json({ success: true, message: "Food Item Added", item });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


const getAllFoodItems = async (req, res) => {
  try {
    const items = await FoodItem.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


const getFoodItemById = async (req, res) => {
  try {
    const item = await FoodItem.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Food Item Not Found" });
    }

    res.json(item);

  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// const updateFoodItem = async (req, res) => {
//   try {
//     const item = await FoodItem.findByPk(req.params.id);

//     if (!item) {
//       return res.status(404).json({ success: false, message: "Food Item Not Found" });
//     }

//     const { name, price, category, description, rating } = req.body;
//     const foodImage = req.file ? req.file.path : item.foodImage;

//     await item.update({
//       name,
//       price,
//       category,
//       description,
//       rating,
//       foodImage
//     });

//     res.json({ success: true, message: "Food Item Updated", item });

//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// ⭐ Update Food Item
const updateFoodItem = async (req, res) => {
  try {
    const item = await FoodItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Food Item Not Found" });

    const { name, price, category, description, rating } = req.body;

    let foodImage = item.foodImage; // keep old image by default

    // If new image uploaded, delete old image safely
    if (req.file) {
      if (item.foodImage) {
        const oldImagePath = path.join(__dirname, "..", item.foodImage);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      foodImage = path.join("uploads", "food", req.file.filename);
    }

    await item.update({
      name,
      price,
      category,
      description,
      rating,
      foodImage
    });

    res.json({ success: true, message: "Food Item Updated", item });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
 const deleteFoodItem = async (req, res) => {
  try {
    const item = await FoodItem.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Food Item Not Found" });
    }

    await item.destroy();

    res.json({ success: true, message: "Food Item Deleted" });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
    addFoodItem,
    getAllFoodItems,
    updateFoodItem,
    deleteFoodItem,
    getFoodItemById,

}
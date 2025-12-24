
const express = require('express');
const cors = require('cors');
const app = express();
const path = require("path");
const { initDatabase } = require('./models'); 

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: `http://localhost:5173`, 
}));

app.use(express.json()); 

const userRoutes = require("./routes/userRoutes");
const foodRoutes = require("./routes/fooditemsRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");


app.use("/api/users", userRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// Initialize database and start the server
initDatabase().then(async () => {
    // Start the server after database initialization is complete
    app.listen(PORT, async () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
});


// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const User = require("./models/user");
// const sequelize = require("./config/db");

// const app = express();

// app.use(cors());
// app.use(express.json());

// const userRoutes = require("./routes/userRoutes");
// const foodRoutes = require("./routes/fooditemsRoutes");

// app.use("/api/users", userRoutes);
// app.use("/api/food", foodRoutes);


// // Serve uploads folder
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// sequelize.sync()
//   .then(() => console.log("Tables synced successfully!"))
//   .catch(err => console.log("Error syncing tables:", err));

// sequelize.authenticate()
//   .then(() => console.log("MySQL Connection Successful!"))
//   .catch(err => console.log("MySQL Connection Failed:", err));

// app.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
// });

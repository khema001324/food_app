const express = require("express");
// const { register,login,getAllUsers,updateRole,updateUser,uploadProfileImage } = require("../controllers/userController");
const userController = require("../controllers/userController");
const userrouter = express.Router();

userrouter.post("/register", userController.register);
userrouter.post("/login", userController.login);
userrouter.get("/all-users", userController.getAllUsers);
userrouter.put("/update-role", userController.updateRole);
userrouter.put("/update/:id", userController.updateUser);
userrouter.put(
  "/upload-profile/:id",
  userController.upload.single("profileImage"),
  userController.uploadProfileImage
);

userrouter.put("/change-password/:id", userController.changePassword);
userrouter.post("/forgot-password", userController.forgotPassword);
userrouter.post("/reset-password", userController.resetPassword);


module.exports = userrouter;

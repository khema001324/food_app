const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const { Op } = require("sequelize");


const fs = require("fs");
const path = require("path");
const multer = require("multer");

// ⭐ Automatically create uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Uploads folder created automatically!");
}

// ⭐ Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // save files in uploads folder
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `profile_${req.params.id}${ext}`); // unique filename per user
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});


const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check missing fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check if email already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user"   // default role
    });

    return res.status(201).json({
      message: "User Registered Successfully",
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check empty fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password required" });
    }

    // 2. Check if user exists
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    // 4. Return full user details (you requested)
    return res.status(200).json({
      message: "Login Successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "phone", "address", "profileImage"]
    });

    return res.status(200).json(users);
  } catch (err) {
    console.error("Get All Users Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id, role } = req.body;

    // Validate role
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid Role" });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({ message: "Role Updated Successfully", user });
  } catch (err) {
    console.error("Update Role Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// UPDATE USER DETAILS (user cannot update role)
 const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const { name, email, phone, address, role } = req.body;

    // Role should NOT be updated by user
    if (role) {
      return res.json({
        success: false,
        message: "Role cannot be updated by user"
      });
    }

    // Build updated details dynamically
    const updatedDetails = {};

    if (name) updatedDetails.name = name;
    if (email) updatedDetails.email = email;
    if (phone) updatedDetails.phone = phone;
    if (address) updatedDetails.address = address;

    // If no fields provided
    if (Object.keys(updatedDetails).length === 0) {
      return res.json({
        success: false,
        message: "No fields provided to update"
      });
    }

    await User.update(updatedDetails, { where: { id: userId } });

    // Return updated user
    const updatedUser = await User.findByPk(userId);

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error updating user",
      error
    });
  }
};



// Upload profile image controller
// const uploadProfileImage = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const file = req.file;

//     if (!file) return res.json({ success: false, message: "No file uploaded" });

//     // File path to save in DB
//     const relativePath = `/uploads/${file.filename}`;

//     // Update in DB
//     await User.update({ profileImage: relativePath }, { where: { id: userId } });
//     const updatedUser = await User.findByPk(userId);

//     res.json({ success: true, user: updatedUser });
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: "Error uploading image", error });
//   }
// };

const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.params.id;
    const file = req.file;

    if (!file) return res.json({ success: false, message: "No file uploaded" });

    // Relative path stored in DB
    const relativePath = `/uploads/${file.filename}`;

    await User.update({ profileImage: relativePath }, { where: { id: userId } });
    const updatedUser = await User.findByPk(userId);

    // Send full URL to frontend
    const fullUrlUser = {
      ...updatedUser.dataValues,
      profileImage: `http://localhost:3000${updatedUser.profileImage}`
    };

    res.json({ success: true, user: fullUrlUser });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error uploading image", error });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findByPk(req.params.id);
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if(!isMatch) return res.json({ success: false, message: "Old password is incorrect" });
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.update({ password: hashedPassword }, { where: { id: user.id } });
  res.json({ success: true });
};


// const forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   const user = await User.findOne({ where: { email } });
//   if (!user)
//     return res.json({ success: false, message: "Email not found" });

//   const token = crypto.randomBytes(32).toString("hex");
//   const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

//   await User.update(
//     {
//       resetPasswordToken: token,
//       resetPasswordExpires: expires
//     },
//     { where: { id: user.id } }
//   );

//   const transporter = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//       user: "khema0013@gmail.com",
//       pass: "nayqdwxvhxvtrvqm"
//     }
//   });

//   // ✅ FRONTEND RESET PAGE
//   const resetUrl = `http://localhost:5173/reset-password/${token}`;

//   await transporter.sendMail({
//     to: user.email,
//     subject: "Password Reset - Food App",
//     html: `
//       <h3>Password Reset Request</h3>
//       <p>Click below link to reset your password:</p>
//       <a href="${resetUrl}">${resetUrl}</a>
//       <p>This link expires in 1 hour.</p>
//     `
//   });

//   res.json({ success: true, message: "Reset link sent to email" });
// };


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.json({ success: false, message: "Email not found" });

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.update({
      resetPasswordToken: token,
      resetPasswordExpires: expires
    });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "khema0013@gmail.com",
        pass: "nayqdwxvhxvtrvqm"
      }
    });

    const resetUrl = `http://localhost:5173/reset-password/${token}`;

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset - Food App",
      html: `
        <h3>Password Reset</h3>
        <p>Click below to reset password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Expires in 1 hour</p>
      `
    });

    res.json({ success: true, message: "Reset link sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// const resetPassword = async (req, res) => {
//   const { token, newPassword } = req.body;

//   const user = await User.findOne({
//     where: {
//       resetPasswordToken: token,
//       resetPasswordExpires: { [Op.gt]: Date.now() }
//     }
//   });

//   if (!user) return res.json({ success: false, message: "Invalid or expired token" });

//   const hashedPassword = await bcrypt.hash(newPassword, 10);
//   await User.update(
//     { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null },
//     { where: { id: user.id } }
//   );

//   res.json({ success: true, message: "Password reset successfully" });
// };
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() }
      }
    });

    if (!user)
      return res.json({ success: false, message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = { register,
                   login,
                  getAllUsers,
                  updateRole,
                  updateUser,
                  uploadProfileImage,
                  upload,
                  changePassword,
                  forgotPassword,
                  resetPassword,

                  
 };

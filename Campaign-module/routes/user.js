const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { userModel } = require("../models/user");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, title, fullName, designation } =
      req.body;

    const existing = await userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existing) {
      return res.status(400).json({ Message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
      title,
      fullName,
      designation,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ Message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

  
    console.log("Email received:", email);
    console.log("Password received:", password);

    const user = await userModel.findOne({ email });
    console.log("User found:", user ? "Yes" : "No");
    console.log("User password hash:", user?.password);

    const isMatch = await bcrypt.compare(password, user?.password || "");
    console.log("Password match result:", isMatch);
    const token = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ Message: error.message });
  }
});

module.exports = router;

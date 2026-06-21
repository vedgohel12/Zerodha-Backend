const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ----- REGISTER -----
// Called AFTER otp has been verified successfully on the frontend
router.post("/register", async (req, res) => {
  try {
    const { fullName, phone, email, password } = req.body;

    if (!fullName || !phone || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      phone,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account created successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error during registration" });
  }
});

// ----- LOGIN -----
router.post("/login", async (req, res) => {
  try {
    console.log("🔐 Login attempt for:", req.body.email);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch for:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const jwtSecret = process.env.JWT_SECRET || "dev_jwt_secret";
    if (!process.env.JWT_SECRET) {
      console.warn("⚠️ WARNING: JWT_SECRET is not set. Using fallback secret for development.");
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "7d",
    });

    console.log("✅ Login successful for:", email);
    console.log("🔑 Token generated:", token.slice(0, 20) + "...");

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
});

// ----- PROFILE (protected) -----
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    console.log("📡 Profile endpoint called - userId:", req.userId);
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      console.log("❌ User not found for ID:", req.userId);
      return res.status(404).json({ message: "User not found" });
    }
    console.log("✅ Profile fetched for:", user.email);
    return res.json({ user });
  } catch (err) {
    console.error("Profile error:", err);
    return res.status(500).json({ message: "Server error fetching profile" });
  }
});

module.exports = router;

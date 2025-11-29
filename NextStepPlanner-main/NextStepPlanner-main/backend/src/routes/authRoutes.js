const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
  
  // Log request for debugging (remove in production)
  if (process.env.NODE_ENV === "development") {
    console.log("Signup request:", { name: name?.substring(0, 10) + "...", email, hasPassword: !!password });
  }

    // Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Trim and validate email
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid email address" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    try {
      const existingUser = await User.findOne({ email: trimmedEmail });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User already exists with this email" });
      }
    } catch (dbError) {
      console.error("Database error checking existing user:", dbError);
      return res.status(500).json({ message: "Database error. Please try again." });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      name: name.trim(),
      email: trimmedEmail,
      passwordHash,
    });

    try {
      await user.save();
    } catch (saveError) {
      if (saveError.code === 11000) {
        // Duplicate key error (email already exists)
        return res
          .status(400)
          .json({ message: "User already exists with this email" });
      }
      console.error("Error saving user:", saveError);
      return res.status(500).json({ message: "Error creating user. Please try again." });
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not set in environment variables");
      return res.status(500).json({ 
        message: "Server configuration error: JWT_SECRET is missing. Please set it in your .env file." 
      });
    }
    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ 
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Log request for debugging (remove in production)
    if (process.env.NODE_ENV === "development") {
      console.log("Login request:", { email, hasPassword: !!password });
    }

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Find user
    let user;
    try {
      user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    } catch (dbError) {
      console.error("Database error finding user:", dbError);
      return res.status(500).json({ message: "Database error. Please try again." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not set in environment variables");
      return res.status(500).json({ 
        message: "Server configuration error: JWT_SECRET is missing. Please set it in your .env file." 
      });
    }
    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

module.exports = router;

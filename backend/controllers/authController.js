const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.error("Registration failed error:", err.message);
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  console.log("Login request received:", req.body); // Debug log

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password doesn't match");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.log("JWT_SECRET missing");
      return res
        .status(500)
        .json({ message: "Server misconfigured: JWT_SECRET missing" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login failed error:", err.message); // Error log
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};


// Get user profile (protected)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    console.error("Profile fetch error:", err.message); // ✅ Log error
    res
      .status(500)
      .json({ message: "Fetching profile failed", error: err.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };

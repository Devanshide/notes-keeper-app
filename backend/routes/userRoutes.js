const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected
router.get("/profile", authMiddleware, getUserProfile);

module.exports = router;

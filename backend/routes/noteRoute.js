const express = require("express");
const router = express.Router();
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

const authMiddleware = require("../middleware/authMiddleware");

// Protected routes
router.post("/", authMiddleware, createNote);
router.get("/", authMiddleware, getNotes);
router.put("/update/:id", authMiddleware, updateNote);
router.delete("/delete/:id", authMiddleware, deleteNote);

module.exports = router;

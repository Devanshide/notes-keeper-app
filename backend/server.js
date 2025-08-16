require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoute"); // singular, because file is noteRoute.js

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Connect to DB
connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  });

// Routes
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Server error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

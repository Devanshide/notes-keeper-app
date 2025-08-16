const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI missing in .env");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
  } catch (error) {
    console.error("MongoDB connection failed ❌", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

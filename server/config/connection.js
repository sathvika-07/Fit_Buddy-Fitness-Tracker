require("dotenv").config();
const mongoose = require("mongoose");

// Optional: To suppress strict query warnings
mongoose.set("strictQuery", false);

// Verify MongoDB URI is loaded
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI environment variable is not set!");
  console.error("Please check your .env file.");
  process.exit(1);
}

console.log("🔗 Connecting to MongoDB:", process.env.MONGODB_URI.replace(/:[^@]*@/, ':***@'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // 5 second timeout
})
  .then(() => {
    const isLocal = process.env.MONGODB_URI.includes('localhost');
    console.log(isLocal ? "✅ Connected to local MongoDB!" : "✅ Connected to MongoDB Atlas!");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    if (process.env.MONGODB_URI.includes('localhost')) {
      console.error("💡 Make sure MongoDB is running locally. You can start it with: net start MongoDB");
    } else {
      console.error("💡 If using MongoDB Atlas, check your IP whitelist and connection string.");
    }
    process.exit(1); // Exit the process with failure
  });

module.exports = mongoose.connection;

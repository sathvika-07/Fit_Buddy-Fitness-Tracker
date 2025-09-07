require("dotenv").config();
const express = require("express");
const path = require("path");
const routes = require("./routes");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
const app = express();

console.log("🚀 Starting server...");

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets from the React frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

// API routes
app.use(routes);

// Wait for MongoDB connection before starting server
db.once("open", () => {
  console.log("✅ MongoDB connected");
  app.listen(PORT, () => {
    console.log(`🌐 API server running on http://localhost:${PORT}`);
  });
});

// Handle MongoDB connection errors
db.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

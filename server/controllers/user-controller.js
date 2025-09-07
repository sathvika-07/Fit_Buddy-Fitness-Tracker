const { User } = require("../models");
const { signToken } = require("../utils/auth");

module.exports = {
  // Get a single user by ID or username
  async getSingleUser({ user = null, params }, res) {
    try {
      const foundUser = await User.findOne({
        $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
      })
        .select("-__v -password")
        .populate("cardio")
        .populate("resistance");

      if (!foundUser) {
        return res.status(404).json({ success: false, message: "User not found." });
      }

      res.status(200).json({ success: true, data: foundUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error while retrieving user." });
    }
  },

  // Signup
  async createUser({ body }, res) {
    try {
      const { username, email, password } = body;

      // Manual validation
      if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required." });
      }

      // Check if username or email already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Username or email already registered."
        });
      }

      // Create user
      const user = await User.create(body);

      // Generate JWT
      const token = signToken(user);

      res.status(201).json({
        success: true,
        message: "User registered successfully.",
        token,
        user
      });
    } catch (err) {
      console.error("Error during user registration:", err);

      if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
          success: false,
          message: messages.join(", ")
        });
      }

      res.status(500).json({ success: false, message: "Error creating user. Try again later." });
    }
  },

  // Login
  async login({ body }, res) {
    try {
      const { email, password } = body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required." });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ success: false, message: "No account found with this email." });
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        return res.status(401).json({ success: false, message: "Incorrect password." });
      }

      const token = signToken(user);

      res.status(200).json({
        success: true,
        message: "Login successful.",
        token,
        user
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ success: false, message: "Login failed. Try again later." });
    }
  }
};

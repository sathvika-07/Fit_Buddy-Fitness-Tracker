const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "Username is required"],
  },
  password: {
    type: String,
    trim: true,
    required: [true, "Password is required"],
    minlength: [4, "Password must be at least 4 characters long"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
  cardio: [{
    type: Schema.Types.ObjectId,
    ref: "Cardio"
  }],
  resistance: [{
    type: Schema.Types.ObjectId,
    ref: "Resistance"
  }]
});

// Hash user password
UserSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// Custom method to compare and validate password for login
UserSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", UserSchema);

module.exports = User;

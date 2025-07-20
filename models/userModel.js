const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  full_name: String,
  username: {
    type: String,
    required: [true, "User must have an username"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "User must have a password"],
    minlength: [8, "Password must be at least 8 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
  },
  password_confirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: [
      function (el) {
        return el === this.password;
      },
      "Passwords are not the same",
    ],
  },
  password_changed_at: Date,
});

//  Hashes password if modified and removes confirm field
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.password_confirm = undefined;

  next();
});

//Instance method to compare entered password with hashed password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model("User", userSchema);

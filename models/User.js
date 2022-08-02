const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    img: { type: String  },
    wallet: { type: Number, default: 0 },
    phoneNumber: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);
// it creates the date that account created/updated at

module.exports = mongoose.model("User", UserSchema);

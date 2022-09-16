const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: false },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    details: { type: Array, required: true },
    feature: { type: String, default: "none" },
  },
  { timestamps: true }
);
// it creates the date that account created/updated at

module.exports = mongoose.model("Product", ProductSchema);

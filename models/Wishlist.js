const mongoose = require("mongoose");
const WishlistSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true, unique: true },
    products: [
      {
        productID: { type: String, required: true },
        title: { type: String, required: true},
        desc: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        details: { type: Array, required: true },
      },
    ],
  },
  { timestamps: true }
);
// it creates the date that account created/updated at

module.exports = mongoose.model("Wishlist", WishlistSchema);

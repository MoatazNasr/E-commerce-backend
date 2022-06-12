const mongoose = require("mongoose");
const CartSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true , unique:true},
    products: [
      {
        productID: { type: String, required: true },
        title: { type: String, required: true},
        desc: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        details: { type: Array, required: true },
        selectedSize:{type:String,required:true},
        selectedColor:{type:String,required:true},
        quantity: { type: Number, default:1},
      },
    ],  },
  { timestamps: true }
);
// it creates the date that account created/updated at

module.exports = mongoose.model("Cart", CartSchema);

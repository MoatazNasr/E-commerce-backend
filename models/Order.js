const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true },
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
        quantity: { type: Number, default: 1 },
      },
    ],
    amount: { type: Number, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);

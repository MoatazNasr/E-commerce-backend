const router = require("express").Router();
const dotenv = require("dotenv");
const { verifyToken, authenticateUser } = require("../utils/middlewares");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const catchAsync = require("../utils/catchAsync");
const { default: Stripe } = require("stripe");
router.post(
  "/:id",
  verifyToken,
  authenticateUser,
  catchAsync(async (req, res) => {
    const { amount, paymentID, shippingData } = req.body;
    const successfulStripeOrder = await stripe.paymentIntents.create({
      payment_method: paymentID,
      amount,
      currency: "usd",
      confirm: true,
      receipt_email: shippingData.email,
      shipping: {
        address:{
          line1: shippingData.address.line1,
          city: shippingData.address.city,
          state: shippingData.address.state,
          country: shippingData.address.country,
          postal_code: shippingData.address.postal_code
        },
        name: shippingData.name,
      },
      receipt_email: shippingData.email,
    });
    if (successfulStripeOrder) res.json("successful order").status(201);
  })
);

module.exports = router;

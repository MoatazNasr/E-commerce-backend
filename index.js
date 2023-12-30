const express = require("express");
const mongoose = require("mongoose");
const ExpressError = require("./utils/expressError");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user.js");
const productRoutes = require("./routes/product.js");
const cartRoutes = require("./routes/cart.js");
const wishlistRoutes = require("./routes/wishlist.js");
const orderRoutes = require("./routes/order.js");
const stripeRoutes = require("./routes/stripe.js");
const cors = require("cors");

dotenv.config();
const app = express();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("database is connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/checkout", stripeRoutes);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// this is executed when there is not matched route

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Try again!" } = err;

  res.status(statusCode).json(message);
});

app.listen(2002, () => {
  console.log("listens at port 2002");
});
/try it / 

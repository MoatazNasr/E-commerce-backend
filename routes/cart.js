const router = require("express").Router();
const cartSchema = require("../models/Cart");
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const { verifyToken, authenticateUser } = require("../utils/middlewares");
router.post(
  "/",
  catchAsync(async (req, res) => {
    const newCart = await cartSchema({
      userID: req.body.userID,
      products: [],
    });
    const newCartSaved = await newCart.save();
    if (!newCartSaved) throw new expressError(undefined, 500);
    else res.status(201).json(newCartSaved);
  })
);

router.put(
  "/:cartid/:id",
  verifyToken,
  authenticateUser,
  catchAsync(async (req, res) => {
    const updatedcart = await cartSchema.findByIdAndUpdate(
      req.params.cartid,
      {
        userID: req.body.userID,
        products: req.body.products,
      },
      { new: true }
    );
    res.status(200).json(updatedcart);
  })
);
// delete a product from cart
router.delete(
  "/:cartID/:productID/:size/:color/:id",
  verifyToken,
  authenticateUser,
  catchAsync(async (req, res) => {
    const modifiedCart = await cartSchema.findByIdAndUpdate(
      req.params.cartID,
      {
        $pull: {
          products: {
            productID: req.params.productID,
            selectedSize: req.params.size,
            selectedColor: req.params.color,
          },
        },
      },
      { new: true }
    );
    res.json(modifiedCart).status(200);
  })
);
// delete the whole cart
router.delete(
  "/:cartID/:id",
  verifyToken,
  authenticateUser,
  catchAsync(async (req, res) => {
    const modifiedCart = await cartSchema.findByIdAndUpdate(
      req.params.cartID,
      {
       products:[]
      },
      { new: true }
    );
    res.json(modifiedCart).status(200);
  })
);
router.get(
  "/:id",
  verifyToken,
  authenticateUser,
  catchAsync(async (req, res) => {
    const cart = await cartSchema.findOne({ userID: req.params.id });
    res.json(cart).status(200);
  })
);

module.exports = router;

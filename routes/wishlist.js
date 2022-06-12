const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const wishlistSchema = require("../models/Wishlist");
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const { verifyToken, authenticateUser } = require("../utils/middlewares");
router.post(
  "/",
  catchAsync(async (req, res) => {
    const newWishlist = await wishlistSchema({
      userID: req.body.userID,
      products: [],
    });
    const newWishlistSaved = await newWishlist.save();
    if (!newWishlistSaved) throw new expressError(undefined, 500);
    else res.status(201).json(newWishlistSaved);
  })
);

router.put(
  "/:wishlistid/:id",
  verifyToken,
  authenticateUser,
  catchAsync(async (req, res) => {
    const updatedWishlist = await wishlistSchema.findByIdAndUpdate(
      req.params.wishlistid,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(201).json(updatedWishlist);
  })
);
router.delete(
  "/:wishlistID/:productID/:id",
  verifyToken,
  authenticateUser,
  catchAsync(async (req, res) => {
    const modifiedWishlist = await wishlistSchema.findByIdAndUpdate(
      req.params.wishlistID,
      {
        $pull: { products: { productID: req.params.productID } },
      },
      { new: true }
    );
    res.json(modifiedWishlist).status(200);
  })
);

router.get(
  "/:id",
  verifyToken,
  authenticateUser,
  catchAsync(async (req, res) => {
    const Wishlist = await wishlistSchema.findOne({ userID: req.params.id });
    res.json(Wishlist).status(200);
  })
);

module.exports = router;

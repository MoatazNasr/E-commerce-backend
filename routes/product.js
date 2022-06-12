const router = require("express").Router();
const productSchema = require("../models/Product");
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const {
  verifyToken,
  authenticateAdmin,
} = require("../utils/middlewares");
router.post(
  "/",
  verifyToken,
  authenticateAdmin,
  catchAsync(async (req, res) => {
    const newProduct = await productSchema(req.body);
    const newProductSaved = await newProduct.save();
    if (!newProductSaved) throw new expressError(undefined, 500);
    else res.status(201).json(newProductSaved);
  })
);

router.put(
  "/:productID",
  verifyToken,
  authenticateAdmin,
  catchAsync(async (req, res) => {
    const id = req.params.productID;
    const updatedProduct = await productSchema.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(201).json(updatedProduct);
  })
);
router.delete(
  "/:productID",
  verifyToken,
  authenticateAdmin,
  catchAsync(async (req, res) => {
    const id = req.params.productID;
    const deletedUser = await productSchema.findByIdAndDelete(id);
    res.json(deletedUser).status(200);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const specificProduct = await productSchema.findOne({_id:req.params.id});
    res.json(specificProduct).status(200);
  })
);

router.get(
  "/",
  catchAsync(async (req, res) => {
    const categoryQuery = req.query.category;
    if (categoryQuery) {
      products = await productSchema.find({category:{$in:[categoryQuery]}});
    }else {
      products =await productSchema.find({});
    }
    res.json(products).status(200);
  })
);

module.exports = router;

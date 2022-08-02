const router = require("express").Router();
const Order = require("../models/Order");
const orderSchema = require("../models/Order");
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const {
  verifyToken,
  authenticateUser,
  authenticateAdmin,
} = require("../utils/middlewares");
router.post(
  "/:id",
  verifyToken,
  authenticateUser,
  catchAsync(async (req, res) => {
    const neworder = await orderSchema(req.body);
    const neworderSaved = await neworder.save();
    if (!neworderSaved) throw new expressError(undefined, 500);
    else res.status(201).json(neworderSaved);
  })
);

router.put(
  "/:orderid/:id",
  verifyToken,
  authenticateUser,
  catchAsync(async (req, res) => {
    const orderid = req.params.orderid;
    const updatedorder = await orderSchema.findByIdAndUpdate(
      orderid,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(201).json(updatedorder);
  })
);
router.delete(
  "/:id",
  verifyToken,
  authenticateAdmin,
  catchAsync(async (req, res) => {
    const id = req.params.id;
    const deletedOrder = await orderSchema.findByIdAndDelete(id);
    res.json(deletedOrder).status(200);
  })
);

router.get(
  "/:id",
  verifyToken,
  authenticateUser,
  catchAsync(async (req, res) => {
    const specificUserOrders = await orderSchema.find({userID:req.params.id});
    res.json(specificUserOrders).status(200);
  })
);

router.get(
  "/",
  verifyToken,
  authenticateAdmin,
  catchAsync(async (req, res) => {
    const orders = await orderSchema.find({});
    res.json(orders).status(200);
  })
);

router.get(
  "/income",
  verifyToken,
  authenticateAdmin,
  catchAsync(async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(date.setMonth(lastMonth.getMonth() - 1));
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      { $project:{  month: { $month: "createdAt" }, sales: "amount" } },
      { $group: { _id: "$month", total: { $sum: "$sales" } } },
    ]);
    console.log(income);
    res.status(200).json(income);
  })
);
module.exports = router;

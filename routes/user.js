const router = require("express").Router();
const userSchema = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const {
  verifyToken,
  authenticateUser,
  authenticateAdmin,
} = require("../utils/middlewares");
router.post(
  "/register",
  catchAsync(async (req, res) => {
    const ifUserExists = await userSchema.findOne({ email: req.body.email });
    if (ifUserExists) {
      res.status(400).json("user already exists");
    } else {
      const newUser = await userSchema.create({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
          req.body.password,
          process.env.PASSWORD_SECRET
        ).toString(),
      });
      const newUserSaved = await newUser.save();
      res.status(201).json(newUserSaved.id);
    }
  })
);
router.post(
  "/login",
  catchAsync(async (req, res) => {
    const loggingUser = await userSchema.findOne({ email: req.body.email });
    const password = CryptoJS.AES.decrypt(
      loggingUser.password,
      process.env.PASSWORD_SECRET
    ).toString(CryptoJS.enc.Utf8);
    let accessToken = jwt.sign(
      {
        id: loggingUser._id,
        username: loggingUser.username,
        email: loggingUser.email,
        createdAt: loggingUser.createdAt,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );
    if (req.body.password != password)
      throw new expressError("Wrong Credentials", 401);
    else res.status(200).json(accessToken);
  })
);

router.put(
  "/:id",
  verifyToken,
  authenticateUser,
  catchAsync(async (req, res) => {
    const id = req.params.id;
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASSWORD_SECRET
      ).toString();
    }
    const updatedUser = await userSchema.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (updatedUser) res.json(updatedUser).status(200);
    else throw new expressError("Not authenticated!", 401);
  })
);
router.delete(
  "/:id",
  verifyToken,
  authenticateAdmin,
  catchAsync(async (req, res) => {
    const id = req.params.id;
    const deletedUser = await userSchema.findByIdAndDelete(id);
    if (deletedUser) res.json(deletedUser).status(200);
    else throw new expressError("No users!", 405);
  })
);

router.get(
  "/:id",
  verifyToken,
  authenticateUser,
  authenticateAdmin,
  catchAsync(async (req, res) => {
    const specificUser = await userSchema.findOne(req.params.id);
    res.json(specificUser).status(200);
  })
);

router.get(
  "/",
  verifyToken,
  authenticateAdmin,
  catchAsync(async (req, res) => {
    const users = await userSchema.find({});
    if (users) res.json(users).status(200);
  })
);

router.get(
  "/stats",
  verifyToken,
  authenticateAdmin,
  catchAsync(async (req, res) => {
    const users = await userSchema.find({});
    if (users) res.json(users).status(200);
  })
);

module.exports = router;

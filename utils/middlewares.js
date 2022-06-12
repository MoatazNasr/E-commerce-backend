const jwt = require("jsonwebtoken");
const ExpressError = require("./expressError");

const verifyToken = (req, res, next) => {
  const token = req.headers.token.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        throw new ExpressError("Invalid token", 403);
      } else {
        req.user = payload;
        next();
      }
    });
  } else throw new ExpressError("Unauthenticated ", 401);
};

const authenticateUser = (req, res, next) => {
  if (req.user.id === req.params.id || req.user.isAdmin) next();
  else throw new ExpressError("Unauthorized", 401);
};

const authenticateAdmin = (req, res, next) => {
  if (req.user.isAdmin) next();
  else throw new ExpressError("Unauthorized", 401);
};
module.exports = {verifyToken , authenticateUser , authenticateAdmin};

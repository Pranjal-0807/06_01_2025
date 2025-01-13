const jwt = require("jsonwebtoken");
const { ROLES } = require("../db.js");

function authToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  // console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  // console.log(token);

  if (!token) {
    return res.status(400).json({ message: "You need to login!!!" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, tokenData) {
    if (err)
      return res.status(400).json({ message: "Forbidden!!!", error: err });
    req.user = tokenData.user;
    next();
  });
}

function authRole(...allowedRoles) {
  return function (req, res, next) {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(400).json({ message: "You are not allowed!!!" });
    }
    next();
  };
}

module.exports = { authToken, authRole };

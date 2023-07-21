const jwt = require("jsonwebtoken");

const CONFIG = require("../constants/config");

exports.sign = function (user) {
  return jwt.sign({ id: user._id }, CONFIG.SECRETKEY, {
    expiresIn: "1h",
  });
};

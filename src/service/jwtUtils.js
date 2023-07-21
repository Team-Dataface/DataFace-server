const jwt = require("jsonwebtoken");

const CONFIG = require("../constants/config");

exports.sign = function (user) {
  return jwt.sign({ id: user._id }, CONFIG.SECRETKEY, {
    expiresIn: "1h",
  });
};

exports.refresh = function () {
  return jwt.sign({}, CONFIG.SECRET_KEY, {
    expiresIn: "14d",
  });
};

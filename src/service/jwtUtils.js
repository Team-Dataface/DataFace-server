const jwt = require("jsonwebtoken");
const User = require("../models/User");
const errors = require("../constants/error");
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

exports.accessTokenVerify = function (token) {
  try {
    const user = jwt.verify(token, CONFIG.SECRET_KEY);
    return {
      type: true,
      id: user.id,
    };
  } catch (error) {
    return {
      type: false,
      message: error.message,
    };
  }
};

exports.refreshTokenVerify = async function (token, id, next) {
  try {
    const user = await User.findById(id);
    if (token === user.refreshToken) {
      try {
        jwt.verify(token, CONFIG.SECRET_KEY);
        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  } catch (error) {
    error.message = errors.INTERNAL_SERVER_ERROR.message;
    error.status = errors.INTERNAL_SERVER_ERROR.status;

    next(error);
  }

  return null;
};

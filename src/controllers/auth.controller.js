const User = require("../models/User");
const jwt = require("../service/jwtUtils");
const errors = require("../constants/error");
const CONFIG = require("../constants/config");

exports.check = async function (req, res, next) {
  if (!req.user) {
    const error = new Error(errors.NOT_AUTHORIZED.message);
    error.status = errors.NOT_AUTHORIZED.status;

    next(error);
  }

  res.status(200).json({ success: true, userId: req.user });
};

exports.login = async function (req, res, next) {
  let member;

  try {
    const { email, username } = req.body;

    member = await User.findOne({ email });

    if (!member) {
      member = await User.create({ email, username });
    }

    const accessToken = jwt.sign(member);
    const refreshToken = jwt.refresh();

    await User.findByIdAndUpdate(member._id, { refreshToken });

    res
      .status(201)
      .cookie("AccessToken", accessToken, {
        maxAge: CONFIG.ONE_HOUR_IN_MS,
        httpOnly: true,
      })
      .json({ success: true, userId: member._id });
  } catch (error) {
    error.message = errors.NOT_AUTHORIZED.message;
    error.status = errors.INTERNAL_SERVER_ERROR.status;

    next(error);
  }
};

exports.logout = async function (req, res, next) {
  try {
    res.clearCookie("AccessToken", { httpOnly: true });
    res.json({ success: true });
  } catch (error) {
    error.message = errors.INTERNAL_SERVER_ERROR.message;
    error.status = errors.INTERNAL_SERVER_ERROR.status;

    next(error);
  }
};

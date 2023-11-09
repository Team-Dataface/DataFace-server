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

  const user = await User.findById(req.user);

  const userInfo = {
    username: user.username,
    userId: req.user,
  };

  res.status(200).json({ success: true, userInfo });
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

    const user = await User.findByIdAndUpdate(member._id, { refreshToken });

    const userInfo = {
      username: user.username,
      userId: member._id,
    };

    res
      .status(201)
      .cookie("AccessToken", accessToken, {
        maxAge: CONFIG.ONE_HOUR_IN_MS,
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({ success: true, userInfo });
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

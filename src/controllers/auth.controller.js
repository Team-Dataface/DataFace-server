const User = require("../models/User");
const jwt = require("../service/jwtUtils");
const errors = require("../constants/error");

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
      .cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
      })
      .json({ success: true, userId: member._id });
  } catch (error) {
    error.message = errors.INTERNAL_SERVER_ERROR.message;
    error.status = errors.INTERNAL_SERVER_ERROR.status;

    next(error);
  }
};

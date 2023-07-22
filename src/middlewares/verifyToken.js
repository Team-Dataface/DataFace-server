const jwt = require("jsonwebtoken");

const createError = require("http-errors");
const errors = require("../constants/error");
const {
  sign,
  verifyAccessToken,
  verifyRefreshToken,
} = require("../service/jwtUtils");

const User = require("../models/User");

exports.verifyToken = async function (req, res, next) {
  try {
    const { accessToken } = req.cookies;

    if (accessToken) {
      const authResult = verifyAccessToken(accessToken);
      const decodedToken = jwt.decode(accessToken);

      const user = await User.findById(decodedToken.id).lean();

      const refreshResult = await verifyRefreshToken(
        user.refreshToken,
        decodedToken.id,
        next,
      );

      if (!authResult.type && authResult.message === "jwt expired") {
        if (!refreshResult) {
          return next(createError(401, errors.NOT_AUTHORIZED.message));
        }

        const newAccessToken = sign(decodedToken.id);

        res.status(201).cookie("accessToken", newAccessToken, {
          maxAge: 1000 * 60 * 60,
          httpOnly: true,
        });

        return next();
      }

      req.user = decodedToken.id;
      return next();
    }

    return next(createError(401, errors.NOT_AUTHORIZED.message));
  } catch (error) {
    error.message = errors.NOT_AUTHORIZED.message;
    error.status = errors.NOT_AUTHORIZED.status;

    return next(error);
  }
};

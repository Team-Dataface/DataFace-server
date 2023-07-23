const express = require("express");

const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/check", verifyToken, authController.check);

module.exports = router;

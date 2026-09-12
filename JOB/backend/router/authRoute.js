const express = require("express");
const isAuthenticated = require("../middleware/isAuth");
const { VerificationResponse } = require("../controller/verificationResponse");

const AuthRouter = express.Router();

AuthRouter.get("/verify", isAuthenticated, VerificationResponse);

module.exports = AuthRouter;

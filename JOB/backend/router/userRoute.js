const express = require("express");
const {
  register,
  login,
  updateProfile,
  logout,
} = require("../controller/userController");

const isAuthenticated = require("../middleware/isAuth");
const upload = require("../middleware/upload");

const UserRouter = express.Router();

UserRouter.post("/register", upload.single("fileName"), register);
UserRouter.post("/login", upload.none(), login);
UserRouter.post("/profile/update", isAuthenticated, updateProfile); //! isAuthenticated is a middleware(which works between request and response) and updateProfile is a handler function. Middleware usually check,modify, or validate the request and here must call nextd() for continue.
UserRouter.post("/logout", logout);

module.exports = UserRouter;

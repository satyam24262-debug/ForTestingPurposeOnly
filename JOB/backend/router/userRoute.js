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
UserRouter.post("/profile/update", isAuthenticated, updateProfile);
UserRouter.delete("/logout", logout);

module.exports = UserRouter;

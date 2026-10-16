const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);

    if (!decode) {
      throw new Error("Invalid Token");
    }

    const user = await userModel.findById(decode.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.id = user._id;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const requireRole =
  (
    ...roles //! rest operator for creating a array for the giving arguments
  ) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You are not allowed to perform this action" });
    }
    next();
  };

module.exports = isAuthenticated;
module.exports.requireRole = requireRole;

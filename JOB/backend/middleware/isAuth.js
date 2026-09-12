const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "User not authorized" });
  }
  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
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
  (...roles) =>
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

// const jwt = require("jsonwebtoken");

// const isAuthenticated = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;

//     console.log(token);
//     if (!token) {
//       return res.status(401).json({
//         message: "User is not Authorized",
//         success: false,
//       });
//     }

//     const decode = jwt.verify(token, process.env.SECRET_KEY);

//     if (!decode) {
//       return res.status(401).json({
//         message: "Invalid token",
//         success: false,
//       });
//     }

//     req.id = decode.userId;
//     next();
//   } catch (err) {
//     console.log("Error from Authentication", err);
//     res.status(500).json({
//       message: "Internal server Error",
//       err,
//     });
//   }
// };

// module.exports = isAuthenticated;

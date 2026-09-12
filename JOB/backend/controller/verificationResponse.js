const userModel = require("../models/userModel");

exports.VerificationResponse = async (req, res) => {
  try {
    const user = await userModel.findById(req.id).select("-password");
    res.status(200).json({
      message: "successfully verified",
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching user",
      err,
    });
  }
};

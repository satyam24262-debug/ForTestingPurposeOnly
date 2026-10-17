const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { path } = require("..");
const cloudinary = require("cloudinary").v2;

// ! registration of a New User
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, phone, password, role } = req.body;

    if (!fullName || !email || !phone || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const newUser = await userModel.findOne({ email });

    if (newUser) {
      return res.status(409).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    let photo = "";

    if (req.file) {
      photo = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "uploads" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          },
        );

        stream.end(req.file.buffer);
      });
    }

    await userModel.create({
      fullName,
      email,
      phone,
      password: hashPassword,
      role,
      profile: {
        photo,
      },
    });

    return res.status(201).json({
      message: "User is registered successfully",
      success: true,
    });
  } catch (err) {
    console.log("Error in register controller", err);

    return res.status(500).json({
      message: "Server side error",
      success: false,
    });
  }
};

// !User Login
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email is not valid.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Password is not correct.",
        success: false,
      });
    }

    if (role != user.role) {
      return res.status(400).json({
        message: "Role is not valid",
        success: false,
      });
    }

    const token = await jwt.sign(
      {
        userId: user._id,
      },

      process.env.SECRET_KEY,
      { expiresIn: "1d" },
    );

    const newUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profile: user.profile,
    };

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    //httpOnly:-> //? frontend client can't read the token using document.cookie or cookies.get("token") or due to XSS(cross site scripting) main cause
    // sameSite:->// cookie can be accessed from different domain
    // secure:->// cookie can be sent only http
    // path:-> // cookie will be available to every path

    return res.status(200).json({
      message: "Login successful",
      user: newUser,
      token: token,
    });
  } catch (err) {
    console.log("Error in login controller", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// !Logout user
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    });

    res.status(200).json({
      message: "Logout successfully",
      success: true,
    });
  } catch (err) {
    console.log("Error in logout controller", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ! Update Profile of user
exports.updateProfile = async (req, res) => {
  try {
    // const { fullName, email, phone, profile = {} } = req.body;
    const { fullName, email, phone,profile } = req.body;
    
    

    // const { bio = "", skills = [], photo = "" } = profile;
    const { bio = "", skills = [] } = profile;
    

    if (!fullName || !email || !phone || !Array.isArray(skills)) {
      return res.status(400).json({
        message: "Full name, email, phone, and skills are required",
        success: false,
      });
    }

    const skillsArray = skills.map((skill) => skill.trim());

    const userId = req.id;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "user is not found",
        success: false,
      });
    }

    user.fullName = fullName;
    user.email = email;
    user.phone = phone;

    user.profile.bio = bio;
    user.profile.skills = skillsArray;
    // user.profile.photo = photo;
    

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: user.toObject({
        transform: (_, value) => {
          delete value.password;
          return value;
        },
      }),
      success: true,
    });
  } catch (err) {
    console.log("Error in update profile controller", err);

    if (err.code === 11000) {
      return res.status(409).json({
        message: "Email is already in use",
        success: false,
      });
    }

    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

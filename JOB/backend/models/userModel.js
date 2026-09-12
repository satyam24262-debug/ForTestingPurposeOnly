const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Student", "Recruiter"],
      required: true,
    },
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      resume: { type: String },
      resumeOrinalName: { type: String },
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      photo: {
        type: String,
        default: "",
      },
    },
  },

  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      minLength: [3, "Must be at least 3 length, got the value is {VALUE}"],
      maxLength: [20, "Must be at most 20 length, got the value is {VALUE}"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxLength: [30, "email length must not exceeded 30 characters"],
    },
    phone: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
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

const mongoose = require("mongoose");

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongoose connected successfully");
  } catch (err) {
    console.log("MongoDB Connection Error :-", err.message);
    throw new Error(err);
  }
};

module.exports = db;

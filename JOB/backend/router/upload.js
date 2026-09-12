const express = require("express");
const upload = require("./middleware/upload");
const cloudinary = require("cloudinary").v2;

const Uploadrouter = express.Router();

Uploadrouter.post("/upload", upload.single("file"), (req, res) => {
  try {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "uploads" },
      (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json({ url: result.secure_url });
      },
    );

    stream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = Uploadrouter;

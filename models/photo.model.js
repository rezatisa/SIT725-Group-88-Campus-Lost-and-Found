const mongoose = require("mongoose");

// Uploaded report photos are stored in MongoDB, so they are kept in the
// same Docker volume as the reports and survive container restarts.
const photoSchema = new mongoose.Schema(
  {
    data: {
      type: Buffer,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
      enum: ["image/jpeg", "image/png", "image/webp"],
    },
    originalName: {
      type: String,
      trim: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Photo", photoSchema);

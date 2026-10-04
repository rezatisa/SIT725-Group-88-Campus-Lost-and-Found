const mongoose = require("mongoose");
const Photo = require("../models/photo.model");

// Sends the stored image bytes so <img src="/api/photos/:id"> works.
const getPhotoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: "Photo not found" });
    }

    const photo = await Photo.findById(id);
    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    res.set("Content-Type", photo.contentType);
    res.set("Cache-Control", "public, max-age=86400");
    res.send(photo.data);
  } catch (error) {
    console.error("Error fetching photo:", error);
    res.status(500).json({ message: "Error fetching photo", error: error.message });
  }
};

module.exports = { getPhotoById };

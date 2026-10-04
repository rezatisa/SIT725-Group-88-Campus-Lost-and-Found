const express = require("express");
const router = express.Router();
const { getAllItems, createItem, getItemById } = require("../controllers/item.controller");
const { uploadPhotos } = require("../middleware/photo-upload.middleware");

// API Routes
router.get("/", getAllItems);
router.post("/", uploadPhotos, createItem);
router.get("/:id", getItemById);

module.exports = router;
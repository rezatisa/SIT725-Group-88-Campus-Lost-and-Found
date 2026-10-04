const express = require("express");
const router = express.Router();
const { getPhotoById } = require("../controllers/photo.controller");

router.get("/:id", getPhotoById);

module.exports = router;

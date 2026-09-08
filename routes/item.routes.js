const express = require("express");
const router = express.Router();
const { getAllItems, createItem, getItemById } = require("../controllers/item.controller");

// API Routes
router.get("/", getAllItems);
router.post("/", createItem);
router.get("/:id", getItemById);

module.exports = router;
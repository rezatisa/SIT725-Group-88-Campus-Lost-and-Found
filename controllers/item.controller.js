const LostItem = require("../models/lostItem.model");
const FoundItem = require("../models/foundItem.model");
const mongoose = require("mongoose");

// Get all items
const getAllItems = async (req, res) => {
  try {
    const lostItems = await LostItem.find().select("-__v");
    const foundItems = await FoundItem.find().select("-__v");
    
    const transformItem = (item, type) => ({
      id: item._id.toString(),
      _id: item._id,
      type: type,
      title: item.title,
      category: item.category,
      description: item.description,
      date: type === "lost" ? item.lostAt : item.foundAt,
      location: item.campusLocation,
      status: item.status || "active",
      photos: item.photos || [],
      createdAt: item.createdAt,
    });
    
    const allItems = [
      ...lostItems.map(item => transformItem(item, "lost")),
      ...foundItems.map(item => transformItem(item, "found"))
    ];
    
    allItems.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json(allItems);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Error fetching items", error: error.message });
  }
};

// Create item
const createItem = async (req, res) => {
  try {
    const { type, title, category, date, description, campus, building, room, handoverMethod } = req.body;

    if (!type || !title || !category || !date || !description || !campus || !building) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    if (type !== "lost" && type !== "found") {
      return res.status(400).json({
        message: "Type must be 'lost' or 'found'",
      });
    }

    const itemData = {
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      campusLocation: `${campus}${building ? " - " + building : ""}${room ? ", " + room : ""}`,
      photos: [],
    };

    let newItem;
    if (type === "lost") {
      itemData.lostAt = new Date(date);
      itemData.ownerId = new mongoose.Types.ObjectId();
      newItem = new LostItem(itemData);
    } else {
      itemData.foundAt = new Date(date);
      itemData.ownerId = new mongoose.Types.ObjectId();
      itemData.contactMethod = handoverMethod === "email" ? "email" : "collection";
      if (itemData.contactMethod === "collection") {
        itemData.collectionLocation = "Campus Security / Student Central";
      }
      newItem = new FoundItem(itemData);
    }

    const savedItem = await newItem.save();

    res.status(201).json({
      message: "Report created successfully!",
      item: {
        _id: savedItem._id,
        type: type,
        title: savedItem.title,
        category: savedItem.category,
        description: savedItem.description,
        date: type === "lost" ? savedItem.lostAt : savedItem.foundAt,
        location: savedItem.campusLocation,
        status: savedItem.status,
      },
    });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: "Error creating item", error: error.message });
  }
};

// Get single item
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    
    let item = await LostItem.findById(id);
    let type = "lost";
    
    if (!item) {
      item = await FoundItem.findById(id);
      type = "found";
    }

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({
      ...item.toObject(),
      type: type,
    });
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ message: "Error fetching item", error: error.message });
  }
};

module.exports = {
  getAllItems,
  createItem,
  getItemById,
};
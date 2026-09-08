require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Import routes
const itemRoutes = require("./routes/item.routes");

// Use routes
app.use("/api/items", itemRoutes);

// Student endpoint
app.get("/api/student", (req, res) => {
  res.json({
    name: "Reza Tisa Adi Pratama",
    studentId: "226169199"
  });
});

// Root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "browse.html"));
});

// Export
module.exports = { app };

// Connect & Start
if (require.main === module) {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("ERROR: MONGODB_URI not defined");
    process.exit(1);
  }

  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log("✓ Connected to MongoDB");
      app.listen(PORT, () => {
        console.log(`✓ Server running at http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("✗ MongoDB error:", error.message);
      process.exit(1);
    });
}
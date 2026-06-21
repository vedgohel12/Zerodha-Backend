// routes/apps.js
//
// Same pattern as routes/holdings.js / routes/positions.js —
// a simple GET route that returns all documents from the Apps collection.

const express = require("express");
const router = express.Router();
const AppsModel = require("../models/AppsModel");

// GET /allApps
router.get("/allApps", async (req, res) => {
  try {
    const apps = await AppsModel.find({});
    res.json(apps);
  } catch (err) {
    console.error("❌ Error fetching apps:", err.message);
    res.status(500).json({ message: "Failed to fetch apps." });
  }
});

module.exports = router;
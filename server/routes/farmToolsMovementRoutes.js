const express = require("express");
const FarmToolsMovement = require("../models/FarmToolsMovement");

const router = express.Router();

// Add a new entry
router.post("/add", async (req, res) => {
  try {
    const newEntry = new FarmToolsMovement(req.body);
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ error: "Failed to add entry" });
  }
});

// Get all entries
router.get("/", async (req, res) => {
  try {
    const entries = await FarmToolsMovement.find().sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

// Delete an entry
router.delete("/:id", async (req, res) => {
  try {
    await FarmToolsMovement.findByIdAndDelete(req.params.id);
    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete entry" });
  }
});

module.exports = router;

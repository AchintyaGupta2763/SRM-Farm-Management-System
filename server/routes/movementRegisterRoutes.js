const express = require("express");
const MovementRegister = require("../models/MovementRegister");

const router = express.Router();

// ✅ Add Movement Record
router.post("/add", async (req, res) => {
  try {
    console.log("📥 Incoming Data:", req.body);
    const { name, purpose, place, outTime, inTime, sign, date } = req.body;

    if (!name || !purpose || !place || !outTime || !inTime || !sign || !date) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newRecord = new MovementRegister({ name, purpose, place, outTime, inTime, sign, date });
    await newRecord.save();
    console.log("✅ Record added successfully:", newRecord);
    res.status(201).json(newRecord);
  } catch (error) {
    console.error("❌ Error saving record:", error);
    res.status(500).json({ error: "Failed to add record" });
  }
});

// ✅ Fetch Movement Records by Date Range
router.get("/", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    const records = await MovementRegister.find(query).sort({ date: -1 });
    console.log("📤 Sending Records:", records.length, "records found");
    res.json(records);
  } catch (error) {
    console.error("❌ Error fetching records:", error);
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

// ✅ Delete a Movement Record
router.delete("/:id", async (req, res) => {
  try {
    console.log("🗑 Deleting Record ID:", req.params.id);
    const deletedRecord = await MovementRegister.findByIdAndDelete(req.params.id);

    if (!deletedRecord) {
      return res.status(404).json({ error: "Record not found" });
    }

    console.log("✅ Record deleted:", deletedRecord);
    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting record:", error);
    res.status(500).json({ error: "Failed to delete record" });
  }
});

module.exports = router;

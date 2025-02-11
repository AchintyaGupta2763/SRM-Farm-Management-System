const express = require("express");
const Programme = require("../models/Programme");

const router = express.Router();

// Add new programme record
router.post("/add", async (req, res) => {
  try {
    console.log("📥 Incoming Data:", req.body);
    const {
      date,
      fieldNumber,
      area,
      crop,
      operations,
      trDrM,
      amM,
      amW,
      hM,
      hW,
      drclrM,
      drclrW
    } = req.body;

    if (!date || !fieldNumber || !area || !crop || !operations || 
        !trDrM || !amM || !amW || !hM || !hW || !drclrM || !drclrW) {
      console.error("❌ Missing fields:", req.body);
      return res.status(400).json({ error: "All fields are required" });
    }

    const newRecord = new Programme({
      date,
      fieldNumber,
      area,
      crop,
      operations,
      trDrM: Number(trDrM),
      amM: Number(amM),
      amW: Number(amW),
      hM: Number(hM),
      hW: Number(hW),
      drclrM: Number(drclrM),
      drclrW: Number(drclrW)
    });

    await newRecord.save();
    console.log("✅ Record added successfully:", newRecord);
    res.status(201).json(newRecord);
  } catch (error) {
    console.error("❌ Error saving record:", error);
    res.status(500).json({ error: "Failed to add record" });
  }
});

// Get records by date range
router.get("/", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    const records = await Programme.find(query).sort({ date: -1 });
    console.log("📤 Sending Records:", records.length, "records found");
    res.json(records);
  } catch (error) {
    console.error("❌ Error fetching records:", error);
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

// Delete a record
router.delete("/:id", async (req, res) => {
  try {
    console.log("🗑 Deleting Record ID:", req.params.id);
    const deletedRecord = await Programme.findByIdAndDelete(req.params.id);

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
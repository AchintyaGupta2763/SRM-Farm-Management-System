const express = require("express");
const Forecast = require("../models/Forecast");

const router = express.Router();

// ✅ Add Forecast Data
router.post("/add", async (req, res) => {
  try {
    console.log("📥 Incoming Data:", req.body); // Debug Log
    const {
      date,
      fieldNumber,
      area,
      crop,
      operations,
      men,
      women,
      total,
      forecaster,
    } = req.body;

    if (
      !date ||
      !fieldNumber ||
      !area ||
      !crop ||
      !operations ||
      !men ||
      !women ||
      !total ||
      !forecaster
    ) {
      console.error("❌ Missing fields:", req.body);
      return res.status(400).json({ error: "All fields are required" });
    }

    const newRecord = new Forecast({
      date,
      fieldNumber,
      area,
      crop,
      operations,
      men: Number(men),
      women: Number(women),
      total: Number(total),
      forecaster,
    });

    await newRecord.save();
    console.log("✅ Record added successfully:", newRecord);
    res.status(201).json(newRecord);
  } catch (error) {
    console.error("❌ Error saving record:", error);
    res.status(500).json({ error: "Failed to add record" });
  }
});

// ✅ Fetch Forecasts by Date
router.get("/", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    const records = await Forecast.find(query).sort({ date: -1 });
    console.log("📤 Sending Records:", records.length, "records found");
    res.json(records);
  } catch (error) {
    console.error("❌ Error fetching records:", error);
    res.status(500).json({ error: "Failed to fetch records" });
  }
});


router.put("/:id", async (req, res) => {
  try {
    console.log("🔄 Updating Record ID:", req.params.id, "with data:", req.body);
    const updatedRecord = await Forecast.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedRecord) {
      return res.status(404).json({ error: "Record not found" });
    }

    console.log("✅ Record updated:", updatedRecord);
    res.json(updatedRecord);
  } catch (error) {
    console.error("❌ Error updating record:", error);
    res.status(500).json({ error: "Failed to update record" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    console.log("🗑 Deleting Record ID:", req.params.id);
    const deletedRecord = await Forecast.findByIdAndDelete(req.params.id);

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

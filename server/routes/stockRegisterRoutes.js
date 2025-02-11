const express = require("express");
const StockRegister = require("../models/StockRegister");

const router = express.Router();

// ✅ Add Stock Register Entry
router.post("/add", async (req, res) => {
  try {
    console.log("📥 Incoming Data:", req.body);
    const { department, folioNo, article, unit, stockEntries } = req.body;

    if (!department || !folioNo || !article || !unit || !stockEntries.length) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newRecord = new StockRegister({ department, folioNo, article, unit, stockEntries });

    await newRecord.save();
    console.log("✅ Stock Register Entry Added:", newRecord);
    res.status(201).json(newRecord);
  } catch (error) {
    console.error("❌ Error saving stock entry:", error);
    res.status(500).json({ error: "Failed to add stock entry" });
  }
});

// ✅ Fetch Stock Entries by Department & Date Range
router.get("/", async (req, res) => {
  try {
    const { department, startDate, endDate } = req.query;
    const query = {};

    if (department) query.department = department;
    if (startDate && endDate) query["stockEntries.date"] = { $gte: startDate, $lte: endDate };

    const records = await StockRegister.find(query).sort({ "stockEntries.date": -1 });
    console.log("📤 Sending Records:", records.length, "records found");
    res.json(records);
  } catch (error) {
    console.error("❌ Error fetching stock register:", error);
    res.status(500).json({ error: "Failed to fetch stock entries" });
  }
});

// ✅ Delete a Stock Register Entry
router.delete("/:id", async (req, res) => {
  try {
    console.log("🗑 Deleting Record ID:", req.params.id);
    const deletedRecord = await StockRegister.findByIdAndDelete(req.params.id);

    if (!deletedRecord) {
      return res.status(404).json({ error: "Stock entry not found" });
    }

    console.log("✅ Record deleted:", deletedRecord);
    res.json({ message: "Stock entry deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting stock entry:", error);
    res.status(500).json({ error: "Failed to delete stock entry" });
  }
});

module.exports = router;

const express = require("express");
const FarmProduce = require("../models/FarmProduce");

const router = express.Router();

// ✅ Add new farm produce record with validation
router.post("/add", async (req, res) => {
  try {
    console.log("📥 Incoming Data:", req.body); // Debug Log

    const { date, details, receiptQty, receiptRs, issueQty, issueRate, pageNo } = req.body;

    // ✅ Check if all fields are provided
    if (!date || !details || !receiptQty || !receiptRs || !issueQty || !issueRate || !pageNo) {
      console.error("❌ Missing fields:", req.body);
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ Convert number fields to ensure correct data type
    const newRecord = new FarmProduce({
      date,
      details,
      receiptQty: Number(receiptQty),
      receiptRs: Number(receiptRs),
      issueQty: Number(issueQty),
      issueRate: Number(issueRate),
      pageNo,
    });

    await newRecord.save();
    console.log("✅ Record added successfully:", newRecord);
    res.status(201).json(newRecord);
  } catch (error) {
    console.error("❌ Error saving record:", error);
    res.status(500).json({ error: "Failed to add record" });
  }
});

// ✅ Get records by date range
router.get("/", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    const records = await FarmProduce.find(query).sort({ date: -1 });;
    console.log("📤 Sending Records:", records.length, "records found");
    res.json(records);
  } catch (error) {
    console.error("❌ Error fetching records:", error);
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

// ✅ Update a farm produce record
router.put("/:id", async (req, res) => {
  try {
    console.log("🔄 Updating Record ID:", req.params.id, "with data:", req.body);
    const updatedRecord = await FarmProduce.findByIdAndUpdate(req.params.id, req.body, { new: true });

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

// ✅ Delete a farm produce record
router.delete("/:id", async (req, res) => {
  try {
    console.log("🗑 Deleting Record ID:", req.params.id);
    const deletedRecord = await FarmProduce.findByIdAndDelete(req.params.id);

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

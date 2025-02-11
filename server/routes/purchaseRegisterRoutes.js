const express = require("express");
const PurchaseRegister = require("../models/PurchaseRegister");

const router = express.Router();

// ✅ Add a new purchase entry
router.post("/add", async (req, res) => {
  try {
    console.log("📥 Incoming Data:", req.body);
    const { date, supplier, description, quantity, rate, unit, coe, payno, building } = req.body;

    if (!date || !supplier || !description || !quantity || !rate || !unit || !coe || !payno || !building) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const amount = quantity * rate;

    const newRecord = new PurchaseRegister({
      date,
      supplier,
      description,
      quantity: Number(quantity),
      rate: Number(rate),
      unit,
      amount: Number(amount),
      coe,
      payno,
      building
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

    const records = await PurchaseRegister.find(query).sort({ date: -1 });
    console.log("📤 Sending Records:", records.length, "records found");
    res.json(records);
  } catch (error) {
    console.error("❌ Error fetching records:", error);
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

// ✅ Delete a record
router.delete("/:id", async (req, res) => {
  try {
    console.log("🗑 Deleting Record ID:", req.params.id);
    const deletedRecord = await PurchaseRegister.findByIdAndDelete(req.params.id);

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

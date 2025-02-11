const express = require("express");
const DailyMemorandum = require("../models/DailyMemorandum");

const router = express.Router();

// ✅ Add a new Memorandum for a Date
router.post("/add", async (req, res) => {
  try {
    const { date, memorandums } = req.body;

    let existingRecord = await DailyMemorandum.findOne({ date });

    if (existingRecord) {
      existingRecord.memorandums.push(...memorandums); // ✅ Append New Memo
      await existingRecord.save();
    } else {
      existingRecord = new DailyMemorandum({ date, memorandums });
      await existingRecord.save();
    }

    res.status(201).json(existingRecord);
  } catch (error) {
    console.error("❌ Error adding memorandum:", error);
    res.status(500).json({ error: "Failed to add memorandum" });
  }
});

// ✅ Get Memorandums for a Specific Date
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    const records = await DailyMemorandum.findOne({ date });

    if (!records) return res.json({ memorandums: [] });

    res.json(records);
  } catch (error) {
    console.error("❌ Error fetching memorandums:", error);
    res.status(500).json({ error: "Failed to fetch memorandums" });
  }
});

// ✅ Get Memorandums in a Date Range (Feature 2)
router.get("/filter", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const records = await DailyMemorandum.find({
      date: { $gte: startDate, $lte: endDate },
    });

    res.json(records);
  } catch (error) {
    console.error("❌ Error filtering memorandums:", error);
    res.status(500).json({ error: "Failed to filter memorandums" });
  }
});

// ✅ Delete a Specific Memorandum
router.delete("/:date/:memoId", async (req, res) => {
  try {
    const { date, memoId } = req.params;
    let record = await DailyMemorandum.findOne({ date });

    if (!record) return res.status(404).json({ error: "No memorandum found" });

    record.memorandums = record.memorandums.filter(
      (memo) => memo.memoId !== memoId
    );

    // ✅ Rename remaining memos (Reorder MEMO-2 to MEMO-1)
    record.memorandums.forEach((memo, index) => {
      memo.memoId = `MEMO-${index + 1} of ${date}`;
    });

    await record.save();
    res.json({ message: "Memorandum deleted and reordered", record });
  } catch (error) {
    console.error("❌ Error deleting memorandum:", error);
    res.status(500).json({ error: "Failed to delete memorandum" });
  }
});

module.exports = router;

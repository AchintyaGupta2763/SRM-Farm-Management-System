const express = require("express");
const Attendance = require("../models/Attendance.js");

const router = express.Router();

// ✅ Fetch Attendance Records
router.get("/", async (req, res) => {
  try {
    const records = await Attendance.find().sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
});

// ✅ Add New Attendance Record
router.post("/add", async (req, res) => {
  try {
    const newRecord = new Attendance(req.body);
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: "Failed to add record" });
  }
});
// ✅ Bulk Add Attendance (Auto-Mark Absent)
router.post("/bulk-add", async (req, res) => {
  try {
    const newRecords = await Attendance.insertMany(req.body);
    res.status(201).json(newRecords);
  } catch (error) {
    console.error("Error marking bulk attendance", error);
    res.status(500).json({ error: "Failed to mark bulk attendance" });
  }
});


// ✅ Delete Attendance Record
router.delete("/:id", async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: "Record deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete record" });
  }
});

// ✅ Get Filtered Attendance Records
router.get("/filter", async (req, res) => {
  try {
    const { name, startDate, endDate, month, year } = req.query;
    let query = {};

    if (name) query.name = name;

    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else if (month && year) {
      query.date = { $regex: `^${year}-${month.padStart(2, "0")}-` };
    } else if (year) {
      query.date = { $regex: `^${year}-` };
    } else if (month) {
      query.date = { $regex: `-${month.padStart(2, "0")}-` };
    }

    const records = await Attendance.find(query).sort({ date: -1 });

    console.log("Backend Filtered Data:", records); // ✅ Debugging Backend Output

    res.json(records);
  } catch (error) {
    console.error("Error filtering attendance records", error);
    res.status(500).json({ error: "Failed to fetch filtered records" });
  }
});



module.exports = router;

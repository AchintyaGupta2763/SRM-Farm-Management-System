const express = require("express");
const Forecast = require("../models/Forecast");
const Notification = require("../models/Notification");
const ApprovedCSV = require("../models/ApprovedCSV");
const User = require("../models/User");

const router = express.Router();

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Admins only." });
  }
};

// ✅ Add Forecast Data
router.post("/add", async (req, res) => {
  try {
    console.log("📥 Incoming Data:", req.body);
    const { date, fieldNumber, area, crop, operations, men, women, total, forecaster } = req.body;

    if (!date || !fieldNumber || !area || !crop || !operations || men === undefined || women === undefined || !total || !forecaster) {
      console.error("❌ Missing fields:", req.body);
      return res.status(400).json({ error: "All fields are required" });
    }

    const newRecord = new Forecast({ date, fieldNumber, area, crop, operations, men: Number(men), women: Number(women), total: Number(total), forecaster });
    await newRecord.save();

    // Notify all admins
    const admins = await User.find({ role: "admin" });
    const notifications = admins.map(admin => ({
      user: admin._id,
      message: `New request from ${forecaster} (Field ${fieldNumber}) needs approval`
    }));
    await Notification.insertMany(notifications);

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

// ✅ Update Forecast Data (Admin only)
router.put("/:id", isAdmin, async (req, res) => {
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

// ✅ Delete Forecast Data (Admin only)
router.delete("/:id", isAdmin, async (req, res) => {
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

// ✅ Approve Forecast Data (Admin only)
router.put("/:id/approve", isAdmin, async (req, res) => {
  try {
    console.log("✅ Approving Record ID:", req.params.id);
    const approvedRecord = await Forecast.findByIdAndUpdate(req.params.id, { is_approved: true }, { new: true }).populate("user");

    if (!approvedRecord) {
      return res.status(404).json({ error: "Record not found" });
    }

    // Generate CSV
    const csvData = `Date,Field Number,Area,Crop,Operations,Men,Women,Total,Forecaster,Status\n${
      approvedRecord.date},${approvedRecord.fieldNumber},${approvedRecord.area},${approvedRecord.crop},${approvedRecord.operations},${approvedRecord.men},${approvedRecord.women},${approvedRecord.total},${approvedRecord.forecaster},Approved`;

    // Save CSV
    const approvedCSV = new ApprovedCSV({ request: approvedRecord._id, csvData });
    await approvedCSV.save();

    // Notify user
    const userNotification = new Notification({
      user: approvedRecord.user._id,
      message: `Your request for Field ${approvedRecord.fieldNumber} was approved`
    });
    await userNotification.save();

    console.log("✅ Record approved and user notified:", approvedRecord);
    res.json(approvedRecord);
  } catch (error) {
    console.error("❌ Error approving record:", error);
    res.status(500).json({ error: "Failed to approve record" });
  }
});

// ✅ Decline Forecast Data (Admin only)
router.put("/:id/decline", isAdmin, async (req, res) => {
  try {
    console.log("❌ Declining Record ID:", req.params.id);
    const declinedRecord = await Forecast.findByIdAndUpdate(req.params.id, { is_approved: false }, { new: true });

    if (!declinedRecord) {
      return res.status(404).json({ error: "Record not found" });
    }

    console.log("❌ Record declined:", declinedRecord);
    res.json(declinedRecord);
  } catch (error) {
    console.error("❌ Error declining record:", error);
    res.status(500).json({ error: "Failed to decline record" });
  }
});

module.exports = router;

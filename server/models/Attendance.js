const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["Permanent", "Temporary"], required: true },
  date: { type: String, required: true }, // Stored as string for easy querying
  attendance: { type: String, enum: ["Present", "Absent"], required: true },
}, { timestamps: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;

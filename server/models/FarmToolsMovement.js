const mongoose = require("mongoose");

const FarmToolsMovementSchema = new mongoose.Schema({
  date: { type: String, required: true },
  studentName: { type: String, required: true },
  toolName: { type: String, required: true },
  returnDate: { type: String, required: true },
  returnTime: { type: String, required: true },
  sign: { type: String, required: true }
});

module.exports = mongoose.model("FarmToolsMovement", FarmToolsMovementSchema);

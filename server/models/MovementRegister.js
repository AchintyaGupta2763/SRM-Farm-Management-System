const mongoose = require("mongoose");

const MovementRegisterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  purpose: { type: String, required: true },
  place: { type: String, required: true },
  outTime: { type: String, required: true },
  inTime: { type: String, required: true },
  sign: { type: String, required: true },
  date: { type: String, required: true }
});

module.exports = mongoose.model("MovementRegister", MovementRegisterSchema);

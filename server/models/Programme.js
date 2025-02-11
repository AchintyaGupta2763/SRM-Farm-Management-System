const mongoose = require("mongoose");

const ProgrammeSchema = new mongoose.Schema({
  date: { type: String, required: true },
  fieldNumber: { type: String, required: true },
  area: { type: String, required: true },
  crop: { type: String, required: true },
  operations: { type: String, required: true },
  trDrM: { type: Number, required: true },
  amM: { type: Number, required: true },
  amW: { type: Number, required: true },
  hM: { type: Number, required: true },
  hW: { type: Number, required: true },
  drclrM: { type: Number, required: true },
  drclrW: { type: Number, required: true }
});

module.exports = mongoose.model("Programme", ProgrammeSchema);
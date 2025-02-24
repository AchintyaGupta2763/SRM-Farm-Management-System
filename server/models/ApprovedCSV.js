const mongoose = require("mongoose");

const ApprovedCSVSchema = new mongoose.Schema({
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'Forecast', required: true },
  csvData: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ApprovedCSV", ApprovedCSVSchema);
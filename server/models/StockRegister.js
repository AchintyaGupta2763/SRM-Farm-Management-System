const mongoose = require("mongoose");

const StockRegisterSchema = new mongoose.Schema({
  department: { type: String, required: true },
  folioNo: { type: String, required: true },
  article: { type: String, required: true },
  unit: { type: String, required: true },
  stockEntries: [
    {
      date: { type: String, required: true },
      reference: { type: String, required: true },
      receipts: { type: Number, required: true },
      issues: { type: Number, required: true },
      balance: { type: Number, required: true },
      initials: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model("StockRegister", StockRegisterSchema);

const mongoose = require("mongoose");

const PurchaseRegisterSchema = new mongoose.Schema({
  date: { type: String, required: true },
  supplier: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  unit: { type: String, required: true },
  amount: { type: Number, required: true },
  coe: { type: String, required: true },
  payno: { type: String, required: true },
  building: { type: String, required: true }
});

module.exports = mongoose.model("PurchaseRegister", PurchaseRegisterSchema);

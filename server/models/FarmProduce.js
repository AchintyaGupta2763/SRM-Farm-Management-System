const mongoose = require("mongoose");

const FarmProduceSchema = new mongoose.Schema({
  date: { type: String, required: true },
  details: { type: String, required: true },
  receiptQty: { type: Number, required: true },
  receiptRs: { type: Number, required: true },
  issueQty: { type: Number, required: true },
  issueRate: { type: Number, required: true },
  pageNo: { type: String, required: true }
});

module.exports = mongoose.model("FarmProduce", FarmProduceSchema);

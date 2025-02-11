const mongoose = require("mongoose");

const MemoEntrySchema = new mongoose.Schema({
  fieldNumber: String,
  area: String,
  crop: String,
  weather: String, // ✅ Added Weather Field Here
  workDone: String,
  trDrRs: String,
  amCmRs: String,
  amCwRs: String,
  clrCmRs: String,
  clrCwRs: String,
  salCmRs: String,
  salCwRs: String,
  amountRs: String,
  remarks: String,
});

const MemorandumSchema = new mongoose.Schema({
  memoId: { type: String, required: true }, // ✅ Stores "MEMO-1 of <DATE>"
  entries: [MemoEntrySchema],
});

const DailyMemorandumSchema = new mongoose.Schema({
  date: { type: String, required: true }, // ✅ Ensures multiple memos under same date
  memorandums: [MemorandumSchema], // ✅ Stores multiple memos for each date
});

module.exports = mongoose.model("DailyMemorandum", DailyMemorandumSchema);

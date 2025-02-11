const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ["Permanent", "Temporary"], required: true },
}, { timestamps: true });

const Member = mongoose.model("Member", memberSchema);
module.exports = Member;

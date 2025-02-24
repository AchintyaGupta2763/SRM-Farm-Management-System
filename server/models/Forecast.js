const mongoose = require("mongoose");

const ForecastSchema = new mongoose.Schema({
  date: { type: String, required: true },
  fieldNumber: { type: String, required: true },
  area: { type: String, required: true },
  crop: { type: String, required: true },
  operations: { type: String, required: true },
  men: { type: Number, required: true },
  women: { type: Number, required: true },
  total: { type: Number, required: true },
  forecaster: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  is_approved:{type:Boolean, default:false},
});

module.exports = mongoose.model("Forecast", ForecastSchema);
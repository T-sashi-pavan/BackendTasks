const mongoose = require("mongoose");

const trainSchema = new mongoose.Schema({
  trainNo: { type: Number, required: true, unique: true },
  station: { type: String, required: true },
  departure: { type: Date, required: true }
});

module.exports = mongoose.model("Train", trainSchema);

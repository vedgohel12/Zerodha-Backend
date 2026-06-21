const mongoose = require("mongoose");

const HoldingsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  avg: { type: Number, required: true },
  price: { type: Number, required: true },
  net: { type: String },
  day: { type: String },
});

const HoldingsModel = mongoose.model("Holdings", HoldingsSchema);

module.exports = { HoldingsModel };
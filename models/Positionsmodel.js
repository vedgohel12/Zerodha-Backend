const mongoose = require("mongoose");

const PositionsSchema = new mongoose.Schema({
  product: { type: String, required: true },
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  avg: { type: Number, required: true },
  price: { type: Number, required: true },
  net: { type: String },
  day: { type: String },
  isLoss: { type: Boolean, default: false },
});

const PositionsModel = mongoose.model("Positions", PositionsSchema);

module.exports = { PositionsModel };
// models/FundsModel.js
//
// Schema for the "Funds" / Equity section. There's typically one document
// per user (or one global document for a single-user demo app like this).

const mongoose = require("mongoose");

const fundsSchema = new mongoose.Schema(
  {
    availableMargin: { type: Number, default: 0 },
    usedMargin: { type: Number, default: 0 },
    availableCash: { type: Number, default: 0 },
    openingBalance: { type: Number, default: 0 },
    payin: { type: Number, default: 0 },
    span: { type: Number, default: 0 },
    deliveryMargin: { type: Number, default: 0 },
    exposure: { type: Number, default: 0 },
    optionsPremium: { type: Number, default: 0 },
    collateralLiquid: { type: Number, default: 0 },
    collateralEquity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const FundsModel = mongoose.model("Funds", fundsSchema);

module.exports = { FundsModel };
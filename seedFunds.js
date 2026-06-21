// seedFunds.js
//
// Run this once to populate the Funds collection with sample data:
//   node seedFunds.js
//
// This creates a single Funds document (since this app has one demo account).
// 🔧 Update MONGO_URI if it's not picked up from your .env automatically.

const mongoose = require("mongoose");
const { FundsModel } = require("./models/FundsModel");

const MONGO_URI =
  process.env.MONGO_URI || process.env.MONGO_URL || "mongodb://localhost:27017/zerodha";

const sampleFunds = {
  availableMargin: 4043.10,
  usedMargin: 3757.30,
  availableCash: 4043.10,
  openingBalance: 4043.10,
  payin: 4064.00,
  span: 0.00,
  deliveryMargin: 0.00,
  exposure: 0.00,
  optionsPremium: 0.00,
  collateralLiquid: 0.00,
  collateralEquity: 0.00,
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await FundsModel.deleteMany({}); // clear existing entries before reseeding
    await FundsModel.create(sampleFunds);

    console.log("✅ Seeded Funds document");
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
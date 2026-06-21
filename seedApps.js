// seedApps.js
//
// Run this once to populate the Apps collection with sample data:
//   node seedApps.js
//
// 🔧 Update the MONGO_URI to match your actual connection string
// (copy it from wherever your main server.js connects to MongoDB).

const mongoose = require("mongoose");
const { AppsModel } = require("./models/AppsModel");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/zerodha";

const sampleApps = [
  {
    name: "Console",
    description: "Track your trading and investment performance over time.",
    icon: "https://upload.wikimedia.org/wikipedia/commons/2/24/Zerodha_Logo.png",
  },
  {
    name: "Coin",
    description: "Invest in Direct Mutual Funds for free, no commissions.",
    icon: "https://upload.wikimedia.org/wikipedia/commons/2/24/Zerodha_Logo.png",
  },
  {
    name: "Kite Connect",
    description: "APIs to build trading and investment platforms.",
    icon: "https://upload.wikimedia.org/wikipedia/commons/2/24/Zerodha_Logo.png",
  },
  {
    name: "Varsity",
    description: "Stock market and financial markets education, for free.",
    icon: "https://upload.wikimedia.org/wikipedia/commons/2/24/Zerodha_Logo.png",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await AppsModel.deleteMany({}); // clear existing entries before reseeding
    await AppsModel.insertMany(sampleApps);

    console.log(`✅ Seeded ${sampleApps.length} apps`);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
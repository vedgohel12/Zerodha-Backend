require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const paymentRoutes = require("./routes/paymentRoutes"); // ✅ NEW

const { HoldingsModel } = require("./models/Holdingsmodel");
const { PositionsModel } = require("./models/Positionsmodel");
const { OrdersModel } = require("./models/Ordersmodel");
const { AppsModel } = require("./models/AppsModel");
const { FundsModel } = require("./models/FundsModel");

const app = express();

// Warn if payment gateway keys are not configured — helpful for local development.
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn("⚠️ Razorpay keys not set: RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET. Payments will fail until configured.");
}

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://zerodha-frontend-one-eta.vercel.app",
    "https://zerodha-dashboard-gray.vercel.app",
  ],
  credentials: true,
}));
app.use(express.json());

// Auth Routes
app.use("/api/auth", authRoutes);

// Payment Routes ✅ NEW
app.use("/api/payment", paymentRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("🚀 Zerodha Clone Backend Running Successfully");
});

// =====================
// Holdings Routes
// =====================
app.get("/allHoldings", async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =====================
// Positions Routes
// =====================
app.get("/allPositions", async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =====================
// Orders Routes
// =====================
app.post("/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    if (!name || !qty || !price || !mode) {
      return res.status(400).json({
        success: false,
        message: "name, qty, price and mode are required",
      });
    }

    const orderValue = Number(qty) * Number(price);
    const normalizedMode = String(mode).toUpperCase();

    // Ensure a Funds document exists
    let funds = await FundsModel.findOne({});
    if (!funds) {
      funds = await FundsModel.create({});
    }

    if (normalizedMode === "BUY") {
      if (funds.availableMargin < orderValue) {
        return res.status(400).json({
          success: false,
          message: "Insufficient funds to place this order",
        });
      }

      funds.availableMargin -= orderValue;
      funds.usedMargin += orderValue;
      await funds.save();
    } else if (normalizedMode === "SELL") {
      funds.availableMargin += orderValue;
      funds.usedMargin = Math.max(0, funds.usedMargin - orderValue);
      await funds.save();
    } else {
      return res.status(400).json({
        success: false,
        message: "mode must be either BUY or SELL",
      });
    }

    const newOrder = new OrdersModel({ name, qty, price, mode: normalizedMode });
    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order saved successfully",
      order: newOrder,
      funds,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/allOrders", async (req, res) => {
  try {
    const allOrders = await OrdersModel.find({}).sort({ createdAt: -1 });
    res.json(allOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =====================
// Apps Routes
// =====================
app.get("/allApps", async (req, res) => {
  try {
    const allApps = await AppsModel.find({});
    res.json(allApps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =====================
// Funds Routes
// =====================
app.get("/funds", async (req, res) => {
  try {
    const funds = await FundsModel.findOne({});
    res.json(funds || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =====================
// MongoDB Connection
// =====================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });
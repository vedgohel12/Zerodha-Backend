// models/Ordersmodel.js
//
// Schema for placed orders. Fields match exactly what POST /newOrder
// in server.js sends: name, qty, price, mode.

const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    mode: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },
  },
  { timestamps: true } // adds createdAt / updatedAt — used by GET /allOrders to sort newest-first
);

const OrdersModel = mongoose.model("Orders", ordersSchema);

module.exports = { OrdersModel };
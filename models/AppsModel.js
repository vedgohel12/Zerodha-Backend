// models/AppsModel.js
//
// Schema for the "Apps" section (connected/installed trading apps),
// same pattern as your HoldingsModel / PositionsModel.

const mongoose = require("mongoose");

const appsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String, // URL to the app's icon/logo image
      required: true,
    },
  },
  { timestamps: true }
);

const AppsModel = mongoose.model("Apps", appsSchema);

module.exports = { AppsModel };
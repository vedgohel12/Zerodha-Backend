const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { FundsModel } = require("../models/FundsModel");

function getRazorpayInstance() {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return null;
  }

  return new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
}

router.post("/createOrder", async (req, res) => {
  try {
    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      console.error("❌ Razorpay keys are missing in environment (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET)");
      return res.status(500).json({ error: "Payment gateway not configured. Contact admin." });
    }
    const { amount } = req.body;
    if (!amount || amount < 100) {
      return res.status(400).json({ error: "Minimum amount is ₹100" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ ...order, key_id: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: err.message || "Order creation failed" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      console.error("❌ Razorpay keys are missing in environment (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET)");
      return res.status(500).json({ success: false, error: "Payment gateway not configured. Contact admin." });
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: "Invalid signature" });
    }

    const updatedFunds = await FundsModel.findOneAndUpdate(
      {},
      {
        $inc: {
          availableMargin: amount,
          availableCash: amount,
          openingBalance: amount,
          payin: amount,
        },
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, message: "Payment verified and funds updated", funds: updatedFunds });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ success: false, error: "Verification failed" });
  }
});

module.exports = router;
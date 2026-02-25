const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema({
  items: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      category: { type: String }, // optional
    },
  ],
  discount: { type: String, default: "NONE" },
  total: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["CASH", "CARD", "UPI", "OTHER"],
    default: "CASH",
  },
  // New fields to track who performed the sale
  cashierId: { type: String, default: null },
  cashierName: { type: String, default: null },
  cashierUsername: { type: String, default: null },

  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Sale", SaleSchema);

const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  sku: { type: String, unique: true, required: true },
  stock: { type: Number, default: 100 }, // stock management
});

module.exports = mongoose.model("Product", ProductSchema);

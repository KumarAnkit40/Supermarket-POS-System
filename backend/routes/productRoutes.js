const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ADD a new product
router.post("/", async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      price: Number(req.body.price),
      category: req.body.category,
      sku: req.body.sku,
      stock: Number(req.body.stock),
    });

    await newProduct.save();
    res.json({ message: "Product added ✔", product: newProduct });
  } catch (err) {
    res.status(500).json({ error: "Failed to add product ❌" });
  }
});

// UPDATE product
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        price: Number(req.body.price),
        category: req.body.category,
        stock: Number(req.body.stock),
      },
      { new: true }
    );

    res.json({ message: "Product updated ✔", product: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update product ❌" });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted ✔" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product ❌" });
  }
});

module.exports = router;

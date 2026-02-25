const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const Product = require("../models/Product");

// Create sale & update stock
router.post("/", async (req, res) => {
  try {
    const { items, discount, total, paymentMethod, cashierId, cashierName, cashierUsername } = req.body;

    // Basic validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No items provided" });
    }

    // Update stock for each sold item
    for (const item of items) {
      // ensure item.productId exists
      if (!item.productId) continue;
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -Number(item.quantity || 0) },
      });
    }

    const sale = new Sale({
      items,
      discount,
      total,
      paymentMethod,
      cashierId: cashierId || null,
      cashierName: cashierName || null,
      cashierUsername: cashierUsername || null,
    });

    await sale.save();

    res.json({ message: "Sale completed & stock updated ✔", sale });
  } catch (err) {
    console.error("Sale create error:", err);
    res.status(500).json({ error: "Sale process failed ❌" });
  }
});

// SALES SUMMARY
router.get("/summary", async (req, res) => {
  try {
    const sales = await Sale.find();
    let totalRevenue = 0;
    let itemsSold = 0;

    sales.forEach((sale) => {
      totalRevenue += sale.total;
      sale.items.forEach((i) => {
        itemsSold += i.quantity;
      });
    });

    res.json({
      revenue: totalRevenue,
      bills: sales.length,
      itemsSold,
    });
  } catch (err) {
    console.error("Summary load error:", err);
    res.status(500).json({ error: "Failed to load summary" });
  }
});

// DAILY SALES TREND
router.get("/daily", async (req, res) => {
  try {
    const sales = await Sale.find();
    const daily = {};

    sales.forEach((sale) => {
      const date = new Date(sale.timestamp).toLocaleDateString();
      daily[date] = (daily[date] || 0) + sale.total;
    });

    const result = Object.keys(daily).map((date) => ({
      date,
      revenue: daily[date],
    }));

    res.json(result);
  } catch (err) {
    console.error("Daily data error:", err);
    res.status(500).json({ error: "Failed daily data" });
  }
});

// TOP PRODUCTS
router.get("/top-products", async (req, res) => {
  try {
    const sales = await Sale.find();
    const productSales = {};

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        if (!productSales[item.name]) {
          productSales[item.name] = 0;
        }
        productSales[item.name] += item.quantity;
      });
    });

    const result = Object.keys(productSales).map((name) => ({
      name,
      sold: productSales[name],
    }));

    res.json(result.sort((a, b) => b.sold - a.sold).slice(0, 5));
  } catch (err) {
    console.error("Top products error:", err);
    res.status(500).json({ error: "Failed top products" });
  }
});

// CATEGORY STATS
router.get("/category-stats", async (req, res) => {
  try {
    const sales = await Sale.find();
    const categorySales = {};

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const cat = item.category || "Other";
        categorySales[cat] = (categorySales[cat] || 0) + item.quantity;
      });
    });

    const result = Object.keys(categorySales).map((cat) => ({
      name: cat,
      value: categorySales[cat],
    }));

    res.json(result);
  } catch (err) {
    console.error("Category stats error:", err);
    res.status(500).json({ error: "Failed category data" });
  }
});

/**
 * New endpoint:
 * GET /sales/by-cashier
 * Returns aggregated stats grouped by cashier (cashierName + username)
 */
router.get("/by-cashier", async (req, res) => {
  try {
    // Use MongoDB aggregation to group by cashierUsername or cashierName
    const result = await Sale.aggregate([
      {
        $group: {
          _id: {
            cashierUsername: "$cashierUsername",
            cashierName: "$cashierName",
          },
          totalRevenue: { $sum: "$total" },
          bills: { $sum: 1 },
          itemsSold: { $sum: { $sum: "$items.quantity" } }, // not valid in older mongo versions but we'll compute below fallback
        },
      },
    ]);

    // Fallback: If aggregation above can't compute itemsSold because of $sum inside $sum,
    // compute manually to be safe:
    if (!result || result.length === 0) {
      // compute manually
      const sales = await Sale.find();
      const map = {};

      sales.forEach((sale) => {
        const key = `${sale.cashierUsername || ""}||${sale.cashierName || ""}`;
        if (!map[key]) {
          map[key] = { totalRevenue: 0, bills: 0, itemsSold: 0, cashierUsername: sale.cashierUsername, cashierName: sale.cashierName };
        }
        map[key].totalRevenue += sale.total || 0;
        map[key].bills += 1;
        sale.items.forEach((it) => {
          map[key].itemsSold += it.quantity || 0;
        });
      });

      const manual = Object.keys(map).map((k) => ({
        cashierUsername: map[k].cashierUsername,
        cashierName: map[k].cashierName,
        totalRevenue: map[k].totalRevenue,
        bills: map[k].bills,
        itemsSold: map[k].itemsSold,
      }));

      return res.json(manual);
    }

    // map cleaned result
    const mapped = result.map((r) => ({
      cashierUsername: r._id.cashierUsername,
      cashierName: r._id.cashierName,
      totalRevenue: r.totalRevenue || 0,
      bills: r.bills || 0,
      itemsSold: r.itemsSold || 0,
    }));

    res.json(mapped);
  } catch (err) {
    console.error("By-cashier aggregation error:", err);
    // fallback manual computation
    try {
      const sales = await Sale.find();
      const map = {};
      sales.forEach((sale) => {
        const key = `${sale.cashierUsername || ""}||${sale.cashierName || ""}`;
        if (!map[key]) {
          map[key] = { totalRevenue: 0, bills: 0, itemsSold: 0, cashierUsername: sale.cashierUsername, cashierName: sale.cashierName };
        }
        map[key].totalRevenue += sale.total || 0;
        map[key].bills += 1;
        sale.items.forEach((it) => {
          map[key].itemsSold += it.quantity || 0;
        });
      });

      const manual = Object.keys(map).map((k) => ({
        cashierUsername: map[k].cashierUsername,
        cashierName: map[k].cashierName,
        totalRevenue: map[k].totalRevenue,
        bills: map[k].bills,
        itemsSold: map[k].itemsSold,
      }));

      return res.json(manual);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed by-cashier data" });
    }
  }
});

module.exports = router;

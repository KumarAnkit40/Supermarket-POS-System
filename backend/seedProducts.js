require("dotenv").config();
const connectDB = require("./database");
const Product = require("./models/Product");

const products = [
  { name: "Milk 2L", price: 120, category: "Dairy", sku: "RFID001", stock: 50 },
  { name: "Yogurt 500g", price: 60, category: "Dairy", sku: "RFID002", stock: 80 },
  { name: "Eggs (12)", price: 90, category: "Grocery", sku: "RFID003", stock: 120 },
  { name: "Sugar 1kg", price: 80, category: "Grocery", sku: "RFID004", stock: 200 },
  { name: "Potato Chips", price: 40, category: "Snacks", sku: "RFID005", stock: 70 },
  { name: "Cola 500ml", price: 50, category: "Beverages", sku: "RFID006", stock: 100 },
];

const seed = async () => {
  await connectDB();
  await Product.deleteMany();
  await Product.insertMany(products);
  console.log("Products seeded successfully ✔");
  process.exit();
};

seed();

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database");

const productRoutes = require("./routes/productRoutes");
const salesRoutes = require("./routes/salesRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// connect MongoDB
connectDB();

// routes
app.use("/products", productRoutes);
app.use("/sales", salesRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend + MongoDB + Auth Ready 🚀");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

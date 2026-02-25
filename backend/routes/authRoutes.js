const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Create default admin if missing
const ensureAdminUser = async () => {
  const existingAdmin = await User.findOne({ username: "admin" });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await User.create({
      username: "admin",
      passwordHash,
      role: "admin",
      name: "Admin",
    });
    console.log("Default admin created: admin / admin123");
  }
};

// LOGIN
router.post("/login", async (req, res) => {
  try {
    await ensureAdminUser();

    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid username or password" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid username or password" });

    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET || "dev_secret_key",
      { expiresIn: "8h" }
    );

    return res.json({
      token,
      role: user.role,
      name: user.name,
      username: user.username,
      userId: user._id
    });
  } catch (err) {
    console.error("Login failed", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed loading users" });
  }
});

// Create a new user (cashier/admin) — ADMIN controls only
router.post("/create-user", async (req, res) => {
  try {
    const { name, username, password, role } = req.body;

    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ error: "Username already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      passwordHash,
      role,
    });

    res.json({ message: "User created successfully", user });
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ error: "Failed creating user" });
  }
});

module.exports = router;

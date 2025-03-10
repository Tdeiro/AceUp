const express = require("express");
const { initDB } = require("./src/models/index");
const userRoutes = require("./src/routes/userRoutes");
require("dotenv").config();

const app = express();
app.use(express.json());

// Initialize Database
initDB();

// Register API Routes
app.use("/api/users", userRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("🏖️ Welcome to the Beach Tennis API! 🎾");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

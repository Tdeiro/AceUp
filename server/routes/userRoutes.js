const express = require("express");
const userRoutes = require("./userRoutes"); // ✅ Ensure this path is correct

const router = express.Router();

// ✅ Use the user routes
router.use("/users", userRoutes);

module.exports = router;

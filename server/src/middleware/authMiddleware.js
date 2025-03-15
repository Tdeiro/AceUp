const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

// ✅ Ensure the request has a valid JWT token
exports.authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("🟢 Received token:", token); // ✅ Debugging

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🟢 Decoded token:", decoded); // ✅ Debugging

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("🟢 User found in DB:", user.role); // ✅ Debugging

    req.user = user;
    next();
  } catch (error) {
    console.error("🔴 Authentication error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    console.log("🔵 Checking if user is admin...");
    console.log("🟢 User role:", req.user.role); // ✅ Debugging

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. User is not an admin." });
    }

    next();
  } catch (error) {
    console.error("🔴 Error in isAdmin middleware:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Allow only specific roles to access routes
exports.isRole =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Requires one of: ${roles.join(", ")}`,
      });
    }
    next();
  };

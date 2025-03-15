const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

require("dotenv").config();

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const register = async (req, res) => {
  try {
    const { name, username, email, password, skill_level, role } = req.body;

    if (!skill_level) {
      return res.status(400).json({ message: "Skill level is required." });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      email,
      password_hash: hashedPassword,
      skill_level,
      role,
    });

    const token = generateToken(user);

    res.status(201).json({ token, user });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔵 Login attempt with email:", email);

    // ✅ Ensure email is compared in lowercase
    const user = await User.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      console.log("🔴 No user found with this email.");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("🟢 User found:", user.email, "Role:", user.role);

    // ✅ Debugging: Check if bcrypt.compare is failing
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      console.log("🔴 Bcrypt comparison failed! Password is incorrect.");
      console.log("🔵 Entered password:", password);
      console.log("🔵 Stored hash:", user.password_hash);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("🟢 Password matched. Generating token...");

    // ✅ Generate JWT token
    const token = generateToken(user);
    res.json({ token, user });
  } catch (error) {
    console.error("🔴 Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving profile", error: error.message });
  }
};

module.exports = { register, login, getProfile };

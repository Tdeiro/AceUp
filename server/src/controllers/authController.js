const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const Joi = require("joi");  
require("dotenv").config();


const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
  // skill_level: Joi.string().valid("beginner", "intermediate", "advanced").required(),
  role: Joi.string().valid("player", "admin").required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const register = async (req, res) => {
  try {
    console.log("🔍 Incoming registration data:", req.body);

    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      console.log("❌ Validation Error:", error.details);
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, username, email, password } = value;
    const role = "player"; // 👈 Use "player" as the default role for all new users

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
      role, // 👈 Role is now always "player"
    });

    const token = generateToken(user);
    res.status(201).json({ token, user });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};



const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = value;

    const user = await User.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user);
    res.json({ token, user });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};


const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password_hash"] },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("❌ Error retrieving profile:", error);
    res.status(500).json({ message: "Error retrieving profile", error: error.message });
  }
};

module.exports = { register, login, getProfile };
const User = require("../models/user");

// GET all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, skill_level, city } = req.body;

    const user = await User.create({
      name,
      email,
      password_hash: password,
      skill_level,
      city,
    });

    res.status(201).json({ message: "User created successfully!", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

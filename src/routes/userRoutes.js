const express = require("express");
const { getAllUsers, registerUser } = require("../controllers/userController");

const router = express.Router();

// GET all users
router.get("/", getAllUsers);

// POST - Register a new user
router.post("/register", registerUser);

module.exports = router;

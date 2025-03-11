const express = require("express");
const router = express.Router();

// ✅ Import controllers
const {
  register,
  login,
  getProfile,
} = require("../src/controllers/authController");
const {
  getUserById,
  createUser,
} = require("../src/controllers/userController");
const {
  getAllTournaments,
  createTournament,
} = require("../src/controllers/tournamentController");
const {
  getUserGames,
  createGame,
} = require("../src/controllers/gameController");
const { getAllRankings } = require("../src/controllers/rankingController");
const {
  getUserNotifications,
} = require("../src/controllers/notificationController");

const { authMiddleware } = require("../src/middleware/authMiddleware");

// ✅ Debugging: Ensure routes are being set up
console.log("✅ Setting up routes in routes.js...");

// ✅ Public Auth Routes
router.post("/auth/register", register);
router.post("/auth/login", login);

// ✅ Protected Route (User must be logged in)
router.get("/auth/profile", authMiddleware, getProfile);

// ✅ User Routes
router.get("/users/:id", getUserById);
router.post("/users", createUser);

// ✅ Tournament Routes
router.get("/tournaments", getAllTournaments);
router.post("/tournaments", createTournament);

// ✅ Game Routes
router.get("/games", getUserGames);
router.post("/games", createGame);

// ✅ Ranking Routes
router.get("/rankings", getAllRankings);

// ✅ Notification Routes
router.get("/notifications/:userId", getUserNotifications);

// ✅ Debugging: Print defined routes
console.log(
  "✅ Defined Routes in routes.js:",
  router.stack.map((r) => r.route?.path)
);

// ✅ Ensure router is correctly exported
module.exports = router;

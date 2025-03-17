const express = require("express");
const router = express.Router();


const {
  register,
  login,
  getProfile,
} = require("../src/controllers/authController");
const {
  getUserById,
  createUser,
  getAllUsers,
} = require("../src/controllers/userController");
const {
  getAllTournaments,
  createTournament,
  deleteTournament,
} = require("../src/controllers/tournamentController");
const {
  getUserGames,
  createGame,
} = require("../src/controllers/gameController");
const { getAllRankings } = require("../src/controllers/rankingController");
const {
  getUserNotifications,
} = require("../src/controllers/notificationController");
const cors = require("cors");

const {
  authMiddleware,
  isAdmin,
  isRole,
} = require("../src/middleware/authMiddleware");

// ✅ Debugging: Ensure routes are being set up
console.log("✅ Setting up routes in routes.js...");

router.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
// ✅ Public Auth Routes
router.post("/auth/register", register);
router.post("/auth/login", login);

// ✅ Protected Route (User must be logged in)
router.get("/auth/profile", authMiddleware, getProfile);

// ✅ User Routes
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.get("/user/all", authMiddleware, isAdmin, getAllUsers);

// ✅ Tournament Routes
router.get("/tournaments", getAllTournaments);
router.post(
  "/tournaments",
  authMiddleware,
  isRole("organizer", "admin"),
  createTournament
);

router.delete(
  "/tournaments/:id",
  authMiddleware,
  isRole("organizer", "admin"),
  deleteTournament
);

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

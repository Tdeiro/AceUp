const { User, Tournament, Game, Notification, Ranking } = require("../models");

exports.getAllUsers = async (req, res) => {
  try {
    console.log("🟢 Fetching all users...");
    const users = await User.findAll({
      attributes: ["id", "name", "username", "email", "role", "skill_level"],
    });
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        {
          model: Tournament,
          as: "Tournaments", // ✅ Match alias from models/index.js
          attributes: ["id", "name", "start_date", "location", "status"],
        },
        {
          model: Game,
          as: "GamesAsPlayer1", // ✅ Match alias from models/index.js
          attributes: ["id", "tournament_id", "player_2_id", "score", "status"],
          include: [
            {
              model: User,
              as: "Player2",
              attributes: ["id", "name", "username"],
            },
          ],
        },
        {
          model: Game,
          as: "GamesAsPlayer2", // ✅ Match alias from models/index.js
          attributes: ["id", "tournament_id", "player_1_id", "score", "status"],
          include: [
            {
              model: User,
              as: "Player1",
              attributes: ["id", "name", "username"],
            },
          ],
        },
        {
          model: Notification,
          as: "Notifications", // ✅ Match alias from models/index.js
          attributes: ["id", "message", "read", "created_at"],
        },
        {
          model: Ranking,
          as: "Ranking", // ✅ Match alias from models/index.js
          attributes: ["points", "last_updated"],
        },
      ],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving user", error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

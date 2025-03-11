const { sequelize } = require("../config/database");
const User = require("./User");
const Tournament = require("./tournament");
const Game = require("./game");
const Ranking = require("./ranking");
const Notification = require("./notification");

User.hasMany(Tournament, { foreignKey: "organizer_id", as: "Tournaments" });
Tournament.belongsTo(User, { foreignKey: "organizer_id", as: "Organizer" });

User.hasMany(Game, { foreignKey: "player_1_id", as: "GamesAsPlayer1" });
User.hasMany(Game, { foreignKey: "player_2_id", as: "GamesAsPlayer2" });
Game.belongsTo(User, { foreignKey: "player_1_id", as: "Player1" });
Game.belongsTo(User, { foreignKey: "player_2_id", as: "Player2" });

User.hasOne(Ranking, { foreignKey: "user_id", as: "Ranking" });
Ranking.belongsTo(User, { foreignKey: "user_id", as: "User" });

User.hasMany(Notification, { foreignKey: "user_id", as: "Notifications" });
Notification.belongsTo(User, { foreignKey: "user_id", as: "User" });

const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");
    await sequelize.sync({ alter: true });
    console.log("✅ Tables synchronized!");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  initDB,
  User,
  Tournament,
  Game,
  Ranking,
  Notification,
};

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Game = sequelize.define(
  "Game",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tournament_id: { type: DataTypes.UUID, allowNull: true },
    player_1_id: { type: DataTypes.UUID, allowNull: false },
    player_2_id: { type: DataTypes.UUID, allowNull: false },
    score: { type: DataTypes.STRING, allowNull: true },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: {
      type: DataTypes.ENUM("scheduled", "completed", "cancelled"),
      defaultValue: "scheduled",
    },
  },
  { timestamps: false }
);

module.exports = Game;

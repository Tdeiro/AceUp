const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Tournament = sequelize.define(
  "Tournament",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    organizer_id: { type: DataTypes.UUID, allowNull: false },
    start_date: { type: DataTypes.DATE, allowNull: false },
    end_date: { type: DataTypes.DATE, allowNull: true },
    location: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM("upcoming", "ongoing", "completed"),
      defaultValue: "upcoming",
    },
  },
  { timestamps: false }
);

module.exports = Tournament;

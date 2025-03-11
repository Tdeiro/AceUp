const bcrypt = require("bcryptjs"); // ✅ Ensure bcrypt is imported
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    skill_level: {
      type: DataTypes.ENUM("beginner", "intermediate", "advanced"),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("player", "organizer", "admin"),
      defaultValue: "player",
    },
    rank: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    games_played: { type: DataTypes.INTEGER, defaultValue: 0 },
    games_won: { type: DataTypes.INTEGER, defaultValue: 0 },
    tournaments_played: { type: DataTypes.INTEGER, defaultValue: 0 },
    city: { type: DataTypes.STRING, allowNull: true },
    profile_pic: { type: DataTypes.STRING, allowNull: true },
    notifications_enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
    joined_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    timestamps: false,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password_hash) {
          user.password_hash = await bcrypt.hash(user.password_hash, 10);
        }
      },
    },
  }
);

User.prototype.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;

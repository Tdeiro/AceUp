const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database"); // Import the initialized Sequelize instance

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    skill_level: {
      type: DataTypes.ENUM("beginner", "intermediate", "advanced"),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profile_pic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = User;

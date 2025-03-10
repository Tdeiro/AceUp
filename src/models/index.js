const { sequelize } = require("../config/database");
const User = require("./user");

const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");
    await sequelize.sync({ alter: true });
    console.log("✅ Tables synchronized!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, initDB, User };

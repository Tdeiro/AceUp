const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes"); // ✅ Ensure auth routes are included

const app = express();

// ✅ Apply CORS globally (before routes)
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Allow frontend origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allowed headers
    credentials: true, // ✅ Enable credentials (cookies, authorization headers)
  })
);

// ✅ Handle Preflight OPTIONS requests (Important for CORS)
app.options("*", cors());

// ✅ Middleware
app.use(bodyParser.json());
app.use(express.json());

// ✅ Register API Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes); // ✅ Ensure auth routes are added

// ✅ Database Connection
sequelize
  .sync()
  .then(() => console.log("✅ Banco de dados conectado!"))
  .catch((err) => console.error("❌ Erro ao conectar ao banco de dados:", err));

module.exports = app;

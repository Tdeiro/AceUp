const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/users", userRoutes);

// Conectar ao banco de dados e iniciar o servidor
sequelize
  .sync()
  .then(() => console.log("Banco de dados conectado!"))
  .catch((err) => console.log("Erro ao conectar ao banco de dados:", err));

module.exports = app;

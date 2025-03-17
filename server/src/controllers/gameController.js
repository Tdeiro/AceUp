const { Game } = require("../models");


exports.getUserGames = async (req, res) => {
  try {
    const games = await Game.findAll({
      where: {
        [Op.or]: [{ player_1_id: req.user.id }, { player_2_id: req.user.id }],
      },
    });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving games", error });
  }
};

exports.getAllGames = async (req, res) => {
  try {
    const games = await Game.findAll();
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving games", error });
  }
};

exports.createGame = async (req, res) => {
  try {
    const game = await Game.create(req.body);
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ message: "Error creating game", error });
  }
};

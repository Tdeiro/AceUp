const { Tournament } = require("../models");

exports.getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.findAll();
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tournaments", error });
  }
};

exports.createTournament = async (req, res) => {
  try {
    const tournament = await Tournament.create(req.body);
    res.status(201).json(tournament);
  } catch (error) {
    res.status(500).json({ message: "Error creating tournament", error });
  }
};

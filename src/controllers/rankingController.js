const { Ranking } = require("../models");

exports.getAllRankings = async (req, res) => {
  try {
    const rankings = await Ranking.findAll();
    res.json(rankings);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving rankings", error });
  }
};

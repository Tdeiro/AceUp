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


exports.deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    
    const tournament = await Tournament.findByPk(id);

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    
    if (userRole === "admin" || tournament.organizerId === userId) {
      await tournament.destroy();
      return res.json({ message: "Tournament deleted successfully!" });
    }

    return res.status(403).json({
      message: "Access denied. You can only delete your own tournaments.",
    });
  } catch (error) {
    console.error("❌ Error deleting tournament:", error);
    res
      .status(500)
      .json({ message: "Error deleting tournament", error: error.message });
  }
};

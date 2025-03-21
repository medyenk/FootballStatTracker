import express from "express";
import cors from "cors";
import { createClient } from "@sanity/client";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sanity Client
const sanityClient = createClient({
  projectId: "your_project_id",
  dataset: "production",
  token: "your_sanity_write_token", // Secure API token
  useCdn: false,
  apiVersion: "2024-03-19"
});

// Helper function to update a player's stats
const updatePlayerStats = async (playerId: string, field: string) => {
  await sanityClient.patch(playerId).inc({ [field]: 1 }).commit();
};

// Webhook Endpoint
app.post("/api/update-players", async (req, res) => {
  try {
    const match = req.body; // Match data from Sanity webhook

    if (!match || !match.teamA || !match.teamB) {
      return res.status(400).json({ message: "Invalid match data" });
    }

    const allPlayers = [...match.teamA, ...match.teamB];

    // Update attendance for all players
    for (const player of allPlayers) {
      await updatePlayerStats(player._ref, "attended");
    }

    // Update win/loss/draw stats
    if (match.winner === "teamA") {
      for (const player of match.teamA) await updatePlayerStats(player._ref, "win");
      for (const player of match.teamB) await updatePlayerStats(player._ref, "loss");
    } else if (match.winner === "teamB") {
      for (const player of match.teamB) await updatePlayerStats(player._ref, "win");
      for (const player of match.teamA) await updatePlayerStats(player._ref, "loss");
    } else {
      for (const player of allPlayers) await updatePlayerStats(player._ref, "draw");
    }

    // Update Player of the Match (MOTM)
    if (match.potm) await updatePlayerStats(match.potm._ref, "motm");

    // Update Goal of the Match (GOTM)
    if (match.gotm) await updatePlayerStats(match.gotm._ref, "gotm");

    res.status(200).json({ message: "Player stats updated successfully!" });

  } catch (error) {
    console.error("❌ Error updating player stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

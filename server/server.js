const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 5000;

// File paths
const matchesFilePath = path.join(__dirname, "../src/data/matches.json");
const playersFilePath = path.join(__dirname, "../src/data/players.json");

app.use(cors());
app.use(bodyParser.json());

// Read JSON file
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
};

// Write JSON file
const writeJsonFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

// API to get all matches
app.get("/matches", (req, res) => {
  const matches = readJsonFile(matchesFilePath);
  res.json(matches);
});

// API to get all players
app.get("/players", (req, res) => {
  const players = readJsonFile(playersFilePath);
  res.json(players);
});

// API to add a new match and update player stats
app.post("/matches", (req, res) => {
  let matches = readJsonFile(matchesFilePath);
  let players = readJsonFile(playersFilePath);

  const newMatch = req.body;
  newMatch.id = matches.length > 0 ? matches[matches.length - 1].id + 1 : 1;

  // Add the match to matches.json
  matches.push(newMatch);
  writeJsonFile(matchesFilePath, matches);

  // Update player stats
  players.forEach((player) => {
    if (
      newMatch.teamA.includes(player.id) ||
      newMatch.teamB.includes(player.id)
    ) {
      player.attended += 1; // Increase attendance
    }

    if (newMatch.teamA.includes(player.id) && newMatch.winner === "teamA") {
      player.win += 1; // Increase win for Team A players
    } else if (
      newMatch.teamA.includes(player.id) &&
      newMatch.winner === "teamB"
    ) {
      player.loss += 1; // Increase loss for Team A players
    }

    if (newMatch.teamB.includes(player.id) && newMatch.winner === "teamB") {
      player.win += 1; // Increase win for Team B players
    } else if (
      newMatch.teamB.includes(player.id) &&
      newMatch.winner === "teamA"
    ) {
      player.loss += 1; // Increase loss for Team B players
    }

    if (newMatch.winner === "draw") {
      player.draw += 1; // Increase draw count for all players
    }

    if (newMatch.potm === player.id) {
      player.motm += 1; // Increase Player of the Match count
    }

    if (newMatch.gotm === player.id) {
      player.gotm += 1; // Increase Goal of the Match count
    }
  });

  // Save updated players.json
  writeJsonFile(playersFilePath, players);

  res.status(201).json({
    message: "Match added and player stats updated successfully",
    match: newMatch,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

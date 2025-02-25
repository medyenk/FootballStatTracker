import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import players from "../../data/players.json";
import { useState } from "react";

import styles from "./styles.module.scss"; // Adjust the path according to your project structure

type FormData = {
  date: Date;
  teamA: number[];
  teamB: number[];
  score: { teamA: number; teamB: number };
  playerOfTheMatch: string;
  goalOfTheMatch: string;
};

const schema = yup.object().shape({
  date: yup
    .date()
    .required("Date is required")
    .min(new Date("2025-01-01"), "Date must be after 2025-01-01"),
  teamA: yup
    .array()
    .required("Team A is required")
    .min(8, "At least 8 players must be selected for Team A")
    .max(8, "Only 8 players can be selected for Team A"),
  teamB: yup
    .array()
    .required("Team B is required")
    .min(8, "At least 8 players must be selected for Team B")
    .max(8, "Only 8 players can be selected for Team B"),
  score: yup.object().shape({
    teamA: yup
      .number()
      .required("Score for Team A is required")
      .min(0, "Score cannot be negative"),
    teamB: yup
      .number()
      .required("Score for Team B is required")
      .min(0, "Score cannot be negative"),
  }),
  playerOfTheMatch: yup.string().required("Player of the Match is required"),
  goalOfTheMatch: yup.string().required("Goal of the Match is required"),
});

const UpdateMatchForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      date: new Date(),
      teamA: [],
      teamB: [],
      score: { teamA: 0, teamB: 0 },
      playerOfTheMatch: "",
      goalOfTheMatch: "",
    },
  });

  const [selectedTeamA, setSelectedTeamA] = useState<number[]>([]);
  const [selectedTeamB, setSelectedTeamB] = useState<number[]>([]);

  const handleTeamSelection = (team: string, playerId: number) => {
    let updatedTeam = [...(team === "teamA" ? selectedTeamA : selectedTeamB)];

    if (updatedTeam.includes(playerId)) {
      updatedTeam = updatedTeam.filter((id) => id !== playerId);
    } else if (updatedTeam.length < 8) {
      updatedTeam.push(playerId);
    }

    if (team === "teamA") {
      setSelectedTeamA(updatedTeam);
      setValue("teamA", updatedTeam);
    } else {
      setSelectedTeamB(updatedTeam);
      setValue("teamB", updatedTeam);
    }
  };

  const onSubmit = async (data: FormData) => {
    // Determine the winner based on the score
    let winner = "draw";
    if (data.score.teamA > data.score.teamB) {
      winner = "teamA";
    } else if (data.score.teamA < data.score.teamB) {
      winner = "teamB";
    }

    try {
      const response = await fetch("http://localhost:5000/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: data.date,
          teamA: data.teamA.map(Number),
          teamB: data.teamB.map(Number),
          winner: winner,
          potm: Number(data.playerOfTheMatch),
          gotm: Number(data.goalOfTheMatch),
          score: {
            teamA: Number(data.score.teamA),
            teamB: Number(data.score.teamB),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add match");
      }

      const result = await response.json();
      console.log("Match added successfully:", result);
      alert("Match added successfully!");
    } catch (error) {
      console.error("Error submitting match:", error);
      alert("Error adding match. Please try again.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.title}>Update Match</h1>

      {/* Date Field */}
      <div className={styles.field}>
        <label htmlFor="date" className={styles.label}>
          Match Date
        </label>
        <input
          type="date"
          id="date"
          className={styles.input}
          {...register("date")}
        />
        {errors.date && <p className={styles.error}>{errors.date.message}</p>}
      </div>

      {/* Team A Selection */}
      <div className={styles.field}>
        <label className={styles.label}>Select Players for Team A</label>
        <div className={styles.checkboxGroup}>
          {players.map((player) => (
            <div key={player.id} className={styles.checkboxField}>
              <input
                type="checkbox"
                id={`teamA-${player.id}`}
                checked={selectedTeamA.includes(player.id)}
                onChange={() => handleTeamSelection("teamA", player.id)}
              />
              <label
                htmlFor={`teamA-${player.id}`}
                className={styles.checkboxLabel}
              >
                {player.name}
              </label>
            </div>
          ))}
        </div>
        {errors.teamA && <p className={styles.error}>{errors.teamA.message}</p>}
      </div>

      {/* Team B Selection */}
      <div className={styles.field}>
        <label className={styles.label}>Select Players for Team B</label>
        <div className={styles.checkboxGroup}>
          {players.map((player) => (
            <div key={player.id} className={styles.checkboxField}>
              <input
                type="checkbox"
                id={`teamB-${player.id}`}
                checked={selectedTeamB.includes(player.id)}
                onChange={() => handleTeamSelection("teamB", player.id)}
              />
              <label
                htmlFor={`teamB-${player.id}`}
                className={styles.checkboxLabel}
              >
                {player.name}
              </label>
            </div>
          ))}
        </div>
        {errors.teamB && <p className={styles.error}>{errors.teamB.message}</p>}
      </div>

      {/* Score Fields */}
      <div className={styles.field}>
        <label htmlFor="teamAScore" className={styles.label}>
          Team A Score
        </label>
        <input
          type="number"
          id="teamAScore"
          className={styles.input}
          {...register("score.teamA")}
        />
        {errors.score?.teamA && (
          <p className={styles.error}>{errors.score.teamA.message}</p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="teamBScore" className={styles.label}>
          Team B Score
        </label>
        <input
          type="number"
          id="teamBScore"
          className={styles.input}
          {...register("score.teamB")}
        />
        {errors.score?.teamB && (
          <p className={styles.error}>{errors.score.teamB.message}</p>
        )}
      </div>

      {/* Player of the Match */}
      <div className={styles.field}>
        <label htmlFor="playerOfTheMatch" className={styles.label}>
          Player of the Match
        </label>
        <select
          id="playerOfTheMatch"
          className={styles.select}
          {...register("playerOfTheMatch")}
        >
          <option value="">Select Player</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div>

      {/* Goal of the Match */}
      <div className={styles.field}>
        <label htmlFor="goalOfTheMatch" className={styles.label}>
          Goal of the Match
        </label>
        <select
          id="goalOfTheMatch"
          className={styles.select}
          {...register("goalOfTheMatch")}
        >
          <option value="">Select Player</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className={styles.button}>
        Update Matches
      </button>
    </form>
  );
};

export default UpdateMatchForm;

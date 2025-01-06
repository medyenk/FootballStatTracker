import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import players from "./data/players.json"; // Import player data
import styles from "./styles/matches.module.scss"; // Import SCSS file

const UpdateMatchForm = () => {
  const schema = yup.object().shape({
    date: yup
      .date()
      .required("Date is required")
      .min(new Date("2025-01-01"), "Date must be after 2025-01-01"),
    "score.teamA": yup
      .number()
      .required("Score for Team A is required")
      .min(0, "Score cannot be negative"),
    "score.teamB": yup
      .number()
      .required("Score for Team B is required")
      .min(0, "Score cannot be negative"),
    players: yup.array().min(1, "At least one player must be selected"),
    winner: yup.string().required("Winner is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
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
          className={`${styles.input} ${errors.date ? styles.errorInput : ""}`}
          {...register("date")}
        />
        {errors.date && <p className={styles.error}>{errors.date.message}</p>}
      </div>

      {/* Team A Selection */}
      <div className={styles.field}>
        <label htmlFor="teamA" className={styles.label}>
          Select Players for Team A
        </label>
        <select
          id="teamA"
          className={`${styles.select} ${
            errors.players ? styles.errorInput : ""
          }`}
          {...register("teamA", {
            required: "Please select at least one player for Team A",
          })}
          multiple
        >
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
        {errors.players && (
          <p className={styles.error}>{errors.players.message}</p>
        )}
      </div>

      {/* Team B Selection */}
      <div className={styles.field}>
        <label htmlFor="teamB" className={styles.label}>
          Select Players for Team B
        </label>
        <select
          id="teamB"
          className={`${styles.select} ${
            errors.players ? styles.errorInput : ""
          }`}
          {...register("teamB", {
            required: "Please select at least one player for Team B",
          })}
          multiple
        >
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
        {errors.players && (
          <p className={styles.error}>{errors.players.message}</p>
        )}
      </div>

      {/* Winner Selection */}
      <div className={styles.field}>
        <label htmlFor="winner" className={styles.label}>
          Select Winner
        </label>
        <select
          id="winner"
          className={`${styles.select} ${
            errors.winner ? styles.errorInput : ""
          }`}
          {...register("winner")}
        >
          <option value="">Select Winner</option>
          <option value="teamA">Team A</option>
          <option value="teamB">Team B</option>
        </select>
        {errors.winner && (
          <p className={styles.error}>{errors.winner.message}</p>
        )}
      </div>

      {/* Team A Score */}
      <div className={styles.field}>
        <label htmlFor="teamAScore" className={styles.label}>
          Team A Score
        </label>
        <input
          type="number"
          id="teamAScore"
          className={`${styles.input} ${
            errors["score.teamA"] ? styles.errorInput : ""
          }`}
          {...register("score.teamA")}
        />
        {errors["score.teamA"] && (
          <p className={styles.error}>{errors["score.teamA"].message}</p>
        )}
      </div>

      {/* Team B Score */}
      <div className={styles.field}>
        <label htmlFor="teamBScore" className={styles.label}>
          Team B Score
        </label>
        <input
          type="number"
          id="teamBScore"
          className={`${styles.input} ${
            errors["score.teamB"] ? styles.errorInput : ""
          }`}
          {...register("score.teamB")}
        />
        {errors["score.teamB"] && (
          <p className={styles.error}>{errors["score.teamB"].message}</p>
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
          <option value="">Select Player of the Match</option>
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
          <option value="">Select Goal of the Match</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button type="submit" className={styles.button}>
        Update Matches
      </button>
    </form>
  );
};

export default UpdateMatchForm;

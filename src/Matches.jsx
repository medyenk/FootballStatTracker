import { useForm, Controller } from "react-hook-form";
import players from "./data/players.json"; // Import player data

const UpdateMatchForm = () => {
  const { handleSubmit, control, register, setValue } = useForm({
    defaultValues: {
      date: "",
      teamA: [],
      teamB: [],
      winner: "",
      potm: "",
      gotm: "",
      scoreTeamA: 0,
      scoreTeamB: 0,
    },
  });

  const onSubmit = (data) => {
    const matchData = {
      id: new Date().getTime(), // Unique match ID
      date: data.date,
      teamA: data.teamA.map(Number),
      teamB: data.teamB.map(Number),
      winner: data.winner,
      potm: Number(data.potm),
      gotm: Number(data.gotm),
      score: {
        teamA: Number(data.scoreTeamA),
        teamB: Number(data.scoreTeamB),
      },
    };

    console.log("Match Data Submitted:", matchData);
    // You can now save `matchData` to matches.json or a backend
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Match Date */}
      <div>
        <label>Date:</label>
        <input type="date" {...register("date", { required: true })} />
      </div>

      {/* Team A */}
      <div>
        <label>Team A:</label>
        <Controller
          name="teamA"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              multiple
              onChange={(e) =>
                setValue(
                  "teamA",
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          )}
        />
      </div>

      {/* Team B */}
      <div>
        <label>Team B:</label>
        <Controller
          name="teamB"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              multiple
              onChange={(e) =>
                setValue(
                  "teamB",
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          )}
        />
      </div>

      {/* Winner */}
      <div>
        <label>Winner:</label>
        <select {...register("winner", { required: true })}>
          <option value="">Select Winner</option>
          <option value="teamA">Team A</option>
          <option value="teamB">Team B</option>
        </select>
      </div>

      {/* Player of the Match */}
      <div>
        <label>Player of the Match (POTM):</label>
        <select {...register("potm", { required: true })}>
          <option value="">Select POTM</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div>

      {/* Goal of the Match */}
      <div>
        <label>Goal of the Match (GOTM):</label>
        <select {...register("gotm", { required: true })}>
          <option value="">Select GOTM</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div>

      {/* Scores */}
      <div>
        <label>Score - Team A:</label>
        <input type="number" {...register("scoreTeamA", { required: true })} />
      </div>
      <div>
        <label>Score - Team B:</label>
        <input type="number" {...register("scoreTeamB", { required: true })} />
      </div>

      <button type="submit">Add Match</button>
    </form>
  );
};

export default UpdateMatchForm;

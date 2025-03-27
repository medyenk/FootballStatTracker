import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Divider,
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  Stack,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const schema = z.object({
  date: z.date({ required_error: "Date is required" }),
  teamA: z
    .array(z.string())
    .min(8, "Exactly 8 players must be selected for Team A")
    .max(8, "Exactly 8 players must be selected for Team A"),

  teamB: z
    .array(z.string())
    .min(8, "Exactly 8 players must be selected for Team B")
    .max(8, "Exactly 8 players must be selected for Team B"),

  teamAScore: z
    .number({ invalid_type_error: "Score must be a number" })
    .min(0, "Score cannot be negative"),

  teamBScore: z
    .number({ invalid_type_error: "Score must be a number" })
    .min(0, "Score cannot be negative"),

  playerOfTheMatch: z.string().min(1, "Player of the Match is required"),
  goalOfTheMatch: z.string().min(1, "Goal of the Match is required"),
});

type FormData = z.infer<typeof schema>;

type Player = {
  id: number;
  name: string;
};

const MatchForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date(),
      teamA: [],
      teamB: [],
      teamAScore: 0,
      teamBScore: 0,
      playerOfTheMatch: "",
      goalOfTheMatch: "",
    },
  });

  const [playerOptions, setPlayerOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from("Player")
        .select("id, name")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching players:", error.message);
        return;
      }

      const formatted = data.map((p) => ({
        label: p.name,
        value: p.id.toString(),
      }));

      setPlayerOptions(formatted);
      console.log("Players fetched from Supabase:", formatted);
    };

    fetchPlayers();
  }, []);

  const onSubmit = async (data: FormData) => {

    
    const date = new Date(data.date);

    const teamA = data.teamA.map(Number);
    const teamB = data.teamB.map(Number);
    const teamAScore = data.teamAScore;
    const teamBScore = data.teamBScore;
    const potmId = Number(data.playerOfTheMatch);
    const gotmId = Number(data.goalOfTheMatch);

    const winner =
      teamAScore > teamBScore
        ? "teamA"
        : teamBScore > teamAScore
        ? "teamB"
        : "draw";

    // 1. Insert match
    const { error: insertError } = await supabase.from("Match").insert([
      {
        date,
        teamA,
        teamB,
        teamAScore,
        teamBScore,
        potmId,
        gotmId,
        winner,
      },
    ]);

    if (insertError) {
      console.error("Error inserting match:", insertError);
      alert("Failed to submit match.");
      return;
    }

    // 2. Update all players
    const allPlayers = [...teamA, ...teamB];

    for (const playerId of allPlayers) {
      const isTeamA = teamA.includes(playerId);
      const isWinner =
        (isTeamA && winner === "teamA") || (!isTeamA && winner === "teamB");
      const isLoser =
        (isTeamA && winner === "teamB") || (!isTeamA && winner === "teamA");
      const isDraw = winner === "draw";

      await supabase.rpc("increment_player_stats", {
        player_id_input: playerId,
        attended_inc: 1,
        win_inc: isWinner ? 1 : 0,
        loss_inc: isLoser ? 1 : 0,
        draw_inc: isDraw ? 1 : 0,
      });
    }

    // 3. Update MOTM and GOTM
    await Promise.all([
      supabase.rpc("increment_player_stats", {
        player_id_input: potmId,
        motm_inc: 1,
      }),
      supabase.rpc("increment_player_stats", {
        player_id_input: gotmId,
        gotm_inc: 1,
      }),
    ]);

    alert("Match and player stats updated successfully!");
  };

  return (
    <Paper p="lg" radius="md" withBorder shadow="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <Title order={3}>Match Details</Title>
          <Controller
            name="date"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <DateInput
                label="Match Date"
                placeholder="Pick a date"
                onChange={field.onChange}
                error={errors.date?.message}
              />
            )}
          />
          <Divider />
          <Controller
            name="teamA"
            control={control}
            render={({ field }) => (
              <MultiSelect
                label="Team A"
                placeholder="Select team A players"
                data={playerOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.teamA?.message}
                clearable
              />
            )}
          />

          <Controller
            name="teamB"
            control={control}
            render={({ field }) => (
              <MultiSelect
                label="Team B"
                placeholder="Select team B players"
                data={playerOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.teamB?.message}
                clearable
              />
            )}
          />

          <Divider />
          <Controller
            name="teamAScore"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Team A Score"
                placeholder="Enter team A score"
                value={field.value}
                onChange={field.onChange}
                error={errors.teamAScore?.message}
              />
            )}
          />
          <Controller
            name="teamBScore"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Team B Score"
                placeholder="Enter team B score"
                value={field.value}
                onChange={field.onChange}
                error={errors.teamBScore?.message}
              />
            )}
          />
          <Divider />
          <Controller
            name="playerOfTheMatch"
            control={control}
            render={({ field }) => (
              <Select
                label="Player of the Match"
                placeholder="Select player of the match"
                data={playerOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.playerOfTheMatch?.message}
                clearable
              />
            )}
          />
          <Controller
            name="goalOfTheMatch"
            control={control}
            render={({ field }) => (
              <Select
                label="Goal of the Match"
                placeholder="Select goal of the match"
                data={playerOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.goalOfTheMatch?.message}
                clearable
              />
            )}
          />

          <Button type="submit">Submit Match</Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default MatchForm;

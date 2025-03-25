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
import { DateInput, DatePickerInput } from "@mantine/dates";
import { useState, useEffect } from "react";

const schema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),

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
      date: new Date().toISOString().slice(0, 10),
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

  useEffect(() => {
    const fetchPlayers = async () => {
      const res = await fetch("/api/players");
      const data: Player[] = await res.json();

      const formatted = data.map((p) => ({
        label: p.name,
        value: p.id.toString(),
      }));

      setPlayerOptions(formatted);
      console.log("Players fetched successfully:", formatted);
    };

    fetchPlayers();
  }, []);

  const onSubmit = async (data: FormData) => {
    const date = new Date(data.date);

    let winner = "draw";
    if (data.teamAScore > data.teamBScore) {
      winner = "teamA";
    } else if (data.teamAScore < data.teamBScore) {
      winner = "teamB";
    }

    try {
      const response = await fetch("http://localhost:5001/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: date,
          teamA: data.teamA.map(Number),
          teamB: data.teamB.map(Number),
          winner: winner,
          potm: Number(data.playerOfTheMatch),
          gotm: Number(data.goalOfTheMatch),

          teamAScore: Number(data.teamAScore),
          teamBScore: Number(data.teamBScore),
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

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import players from "../../data/players.json";
import { useState } from "react";
import { Field } from "@/components/ui/field";
import {
  NumberInputField,
  NumberInputRoot,
} from "@/components/ui/number-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Radio, RadioGroup } from "@/components/ui/radio";

import {
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  SelectContent,
  SelectItem,
  createListCollection,
  VStack,
  Button,
  Input,
  CheckboxGroup,
  Fieldset,
  Box,
  Stack,
  HStack,
} from "@chakra-ui/react";

type FormData = {
  date: Date;
  teamA: number[];
  teamB: number[];
  teamAScore: number;
  teamBScore: number;
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
  teamAScore: yup
    .number()
    .required("Score for Team A is required")
    .min(0, "Score cannot be negative"),
  teamBScore: yup
    .number()
    .required("Score for Team B is required")
    .min(0, "Score cannot be negative"),
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
      teamAScore: 0,
      teamBScore: 0,
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
    if (data.teamAScore > data.teamBScore) {
      winner = "teamA";
    } else if (data.teamAScore < data.teamBScore) {
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

  const playersCollection = createListCollection({
    items: players.map((player) => ({
      label: player.name,
      value: player.id,
    })),
  });

  console.log("data", getValues());

  return (
    <VStack gap={4} padding={4} width="100%">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Update Match</h1>

        <Field>
          <label htmlFor="date">Match Date</label>
          <Input type="date" id="date" {...register("date")} />
          {errors.date && <p>{errors.date.message}</p>}
        </Field>

        <Fieldset.Root>
          <CheckboxGroup name="teamA">
            <Fieldset.Legend>Team A</Fieldset.Legend>
            <Box display={"flex"} flexWrap={"wrap"} gap={2}>
              {players.map((player) => (
                <Checkbox
                  key={player.id}
                  value={player.id.toString()}
                  onChange={(e) => handleTeamSelection("teamA", player.id)}
                  checked={selectedTeamA.includes(player.id)}
                >
                  {player.name}
                </Checkbox>
              ))}
            </Box>
          </CheckboxGroup>
        </Fieldset.Root>

        <Fieldset.Root>
          <CheckboxGroup name="teamB">
            <Fieldset.Legend>Team B</Fieldset.Legend>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {players.map((player) => (
                <Checkbox
                  key={player.id}
                  value={player.id.toString()}
                  onChange={(e) => handleTeamSelection("teamB", player.id)}
                  checked={selectedTeamB.includes(player.id)}
                >
                  {player.name}
                </Checkbox>
              ))}
            </Box>
          </CheckboxGroup>
        </Fieldset.Root>

        <Field
          label="Team A Score"
          invalid={!!errors.teamAScore}
          errorText={errors.teamAScore?.message}
        >
          <Controller
            name="teamAScore"
            control={control}
            render={({ field }) => (
              <NumberInputRoot
                name={field.name}
                value={field.value?.toString()}
                onValueChange={({ value }) => {
                  field.onChange(value);
                }}
              >
                <NumberInputField onBlur={field.onBlur} />
              </NumberInputRoot>
            )}
          />
        </Field>

        <Field
          label="Team B Score"
          invalid={!!errors.teamBScore}
          errorText={errors.teamBScore?.message}
        >
          <Controller
            name="teamBScore"
            control={control}
            render={({ field }) => (
              <NumberInputRoot
                name={field.name}
                value={field.value?.toString()}
                onValueChange={({ value }) => {
                  field.onChange(value);
                }}
              >
                <NumberInputField onBlur={field.onBlur} />
              </NumberInputRoot>
            )}
          />
        </Field>

        <Fieldset.Root invalid={!!errors.playerOfTheMatch}>
          <Fieldset.Legend>Player of the Match</Fieldset.Legend>
          <Controller
            name="playerOfTheMatch"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name={field.name}
                value={field.value}
                onValueChange={({ value }) => field.onChange(value)}
              >
                <HStack gap="6" display="flex" flexWrap="wrap">
                  {players.map((player) => (
                    <Radio
                      key={player.id}
                      value={player.id.toString()}
                      inputProps={{ onBlur: field.onBlur }}
                    >
                      {player.name}
                    </Radio>
                  ))}
                </HStack>
              </RadioGroup>
            )}
          />

          {errors.playerOfTheMatch && (
            <Fieldset.ErrorText>
              {errors.playerOfTheMatch?.message}
            </Fieldset.ErrorText>
          )}
        </Fieldset.Root>

        <Fieldset.Root invalid={!!errors.goalOfTheMatch}>
          <Fieldset.Legend>Goal of the Match</Fieldset.Legend>
          <Controller
            name="goalOfTheMatch"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name={field.name}
                value={field.value}
                onValueChange={({ value }) => field.onChange(value)}
              >
                <HStack gap="6" display="flex" flexWrap="wrap">
                  {players.map((player) => (
                    <Radio
                      key={player.id}
                      value={player.id.toString()}
                      inputProps={{ onBlur: field.onBlur }}
                    >
                      {player.name}
                    </Radio>
                  ))}
                </HStack>
              </RadioGroup>
            )}
          />

          {errors.goalOfTheMatch && (
            <Fieldset.ErrorText>
              {errors.goalOfTheMatch?.message}
            </Fieldset.ErrorText>
          )}
        </Fieldset.Root>

        <Button type="submit">Update Matches</Button>
      </form>
    </VStack>
  );
};

export default UpdateMatchForm;

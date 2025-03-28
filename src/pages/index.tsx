import {
  Card,
  Title,
  Text,
  Group,
  SimpleGrid,
  Divider,
  Stack,
  Badge,
  Flex,
  Paper,
  Box,
} from "@mantine/core";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

interface Match {
  id: number;
  date: string;
  winner: string;
  teamA: number[];
  teamB: number[];
  teamAScore: number;
  teamBScore: number;
  potmId: number;
  gotmId: number;
}

type Player = {
  id: number;
  name: string;
  attended: number;
  win: number;
  loss: number;
  draw: number;
  motm: number;
  gotm: number;
  cleansheet: number;
  goalDifference: number;
};

const Index = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data: playerData, error: playerError } = await supabase
        .from("Player")
        .select("*")
        .order("name", { ascending: true });

      const { data: matchData, error: matchError } = await supabase
        .from("Match")
        .select("*")
        .order("date", { ascending: false });

      if (playerError || matchError) {
        setError((playerError || matchError)?.message || "Unknown error");
        return;
      }

      setPlayers(playerData || []);
      setMatches(matchData || []);
      setLoading(false);
    };

    fetchPlayers();
  }, []);

  const convertIdToPlayerName = (id: number) => {
    const player = players.find((p) => p.id === id);
    return player ? player.name : "Unknown Player";
  };


  return (
    <Stack p="lg">
      <Title order={1} ta="center">
        Alperton Thursday FC Statistics
      </Title>

      {loading && <Text>Loading matches...</Text>}
      {error && <Text>{error}</Text>}

      {!loading && !error && matches.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mt="md">
          {matches.map((match) => (
            <Card
              key={match.id}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
            >
              <Card.Section withBorder inheritPadding py="xs">
                <Title order={4}>
                  Match Result for{" "}
                  {new Date(match.date).toLocaleDateString("en-GB")}
                </Title>
              </Card.Section>
              <Card.Section withBorder inheritPadding py="xs">
                  <SimpleGrid cols={2}>
                    <Paper withBorder p="md" radius="md">
                      <Stack gap="0">
                        <Divider
                          mb="sm"
                          label="Team A"
                          labelPosition="center"
                        />
                        <Flex
                          wrap="wrap"
                          gap={5}
                          dir="column"
                          justify="center"
                          align="center"
                          h="100%"
                        >
                          {match.teamA.map((id) => (
                            <Badge
                              key={id}
                              size="lg"
                              color="teal"
                              variant="light"
                            >
                              {convertIdToPlayerName(id)}
                            </Badge>
                          ))}
                        </Flex>
                      </Stack>
                    </Paper>

                    <Paper withBorder p="md" radius="md">
                      <Stack gap="0">
                        <Divider
                          mb="sm"
                          label="Team B"
                          labelPosition="center"
                        />
                        <Flex wrap="wrap" gap={5} justify="center">
                          {match.teamB.map((id) => (
                            <Badge
                              key={id}
                              size="lg"
                              color="teal"
                              variant="light"
                            >
                              {convertIdToPlayerName(id)}
                            </Badge>
                          ))}
                        </Flex>
                      </Stack>
                    </Paper>
                  </SimpleGrid>

                <Divider my="sm" />

                <SimpleGrid cols={3}>
                  <Paper p="md" radius="md" withBorder bg="teal.9">
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      h="100%"
                    >
                      <Text size="sm" fw={500} c="white">
                        POTM
                      </Text>
                      <Text size="lg" fw={700} c="white">
                        {convertIdToPlayerName(match.potmId)}
                      </Text>
                    </Flex>
                  </Paper>
                  <Paper p="md" radius="md" withBorder bg="teal.9">
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      h="100%"
                    >
                      <Text size="sm" fw={500} c="white">
                        Score
                      </Text>
                      <Text size="lg" fw={700} c="white">
                        {match.teamAScore} - {match.teamBScore}
                      </Text>
                    </Flex>
                  </Paper>
                  <Paper p="md" radius="md" withBorder bg="teal.9">
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      h="100%"
                    >
                      <Text size="sm" fw={500} c="white">
                        GOTM
                      </Text>
                      <Text size="lg" fw={700} c="white">
                        {convertIdToPlayerName(match.gotmId)}
                      </Text>
                    </Flex>
                  </Paper>
                </SimpleGrid>
              </Card.Section>
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        !loading && <Text>No matches found.</Text>
      )}
    </Stack>
  );
};

export default Index;

import {
  Table,
  Paper,
  Title,
  ScrollArea,
  Center,
  Loader,
  Text,
  Badge,
  Stack,
  UnstyledButton,
  Group,
} from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { Player } from "@/types/types";

const Leaderboard = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<keyof Player>("win");
  const [sortAsc, setSortAsc] = useState(false);

  const sortPlayers = (key: keyof Player) => {
    if (key === sortBy) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(key);
      setSortAsc(false);
    }
  };

  const sortedPlayers = [...players].sort((a, b) => {
    const aVal = a[sortBy] ?? 0;
    const bVal = b[sortBy] ?? 0;
    return sortAsc ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
  });

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase.from("Player").select("*");
      if (error) {
        console.error("Error fetching leaderboard:", error.message);
        return;
      }
      setPlayers(data ?? []);
      setLoading(false);
    };
    fetchPlayers();
  }, []);

  const renderSortableHeader = (label: string, key: keyof Player) => (
    <UnstyledButton onClick={() => sortPlayers(key)}>
      <Group gap={4} wrap="nowrap">
        <Text fw={500}>{label}</Text>
        {sortBy === key &&
          (sortAsc ? (
            <IconChevronUp size={14} />
          ) : (
            <IconChevronDown size={14} />
          ))}
      </Group>
    </UnstyledButton>
  );

  const winPercentage = (win: number, total: number) => {
    if (total === 0) return "0%";
    return ((win / total) * 100).toFixed(0) + "%";
  };

  return (
    <Paper p="lg" radius="md" withBorder shadow="md">
      <Stack gap="md">
        <Title order={2} ta="center" c="teal.3">
          🏆 Player Leaderboard
        </Title>

        {loading ? (
          <Center py="md">
            <Loader />
          </Center>
        ) : players.length === 0 ? (
          <Text ta="center" c="dimmed">
            No players found.
          </Text>
        ) : (
          <ScrollArea>
            <Table
              striped
              highlightOnHover
              withColumnBorders
              horizontalSpacing="md"
              verticalSpacing="xs"
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>#</Table.Th>
                  <Table.Th>{renderSortableHeader("Player", "name")}</Table.Th>
                  <Table.Th>
                    {renderSortableHeader("Games", "attended")}
                  </Table.Th>
                  <Table.Th>{renderSortableHeader("Wins", "win")}</Table.Th>
                  <Table.Th>{renderSortableHeader("Draws", "draw")}</Table.Th>
                  <Table.Th>{renderSortableHeader("Losses", "loss")}</Table.Th>
                  <Table.Th>{renderSortableHeader("MOTM", "motm")}</Table.Th>
                  <Table.Th>{renderSortableHeader("GOTM", "gotm")}</Table.Th>
                  <Table.Th>
                    {renderSortableHeader("CS", "cleansheet")}
                  </Table.Th>
                  <Table.Th>
                    {renderSortableHeader("GD", "goal_difference")}
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {sortedPlayers.map((player, index) => (
                  <Table.Tr key={player.id}>
                    <Table.Td>
                      <Badge color="gray" variant="light">
                        {index + 1}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500}>{player.name}</Text>
                    </Table.Td>
                    <Table.Td>{player.attended}</Table.Td>
                    <Table.Td>
                      <Text c="teal">{player.win}</Text>

                      <Text c="yellow">
                        {winPercentage(player.win, player.attended)}
                      </Text>
                    </Table.Td>
                    <Table.Td>{player.draw}</Table.Td>
                    <Table.Td>
                      <Text c="red.4">{player.loss}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color="yellow" variant="light">
                        {player.motm}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge color="pink" variant="light">
                        {player.gotm}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge color="blue" variant="light">
                        {player.cleansheet}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text
                        c={player.goal_difference >= 0 ? "green.4" : "red.4"}
                        fw={500}
                      >
                        {player.goal_difference}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        )}
      </Stack>
    </Paper>
  );
};

export default Leaderboard;

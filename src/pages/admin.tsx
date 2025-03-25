import { Container, Title, Center } from "@mantine/core";
import MatchForm from "../components/MatchForm";

export default function AdminPage() {
  return (
    <Center h="100vh">
      <Container size="sm">
        <Title order={2} ta="center" mb="md">
          Admin - Add a New Match
        </Title>
        <MatchForm />
      </Container>
    </Center>
  );
}

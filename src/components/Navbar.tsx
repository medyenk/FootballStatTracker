import {
  Group,
  Burger,
  Drawer,
  Button,
  Stack,
  Box,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const links = [
  { label: "Home", href: "/" },
  { label: "Leaderboard", href: "/leaderboard" },
];

const Navbar = () => {
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <Box p="md" bg="dark.7">
      <Group justify="space-between">
        <Title order={3} c="teal.3">
          Alperton Thursdays
        </Title>
        <Group visibleFrom="sm">
          {links.map((link) => (
            <Button
              key={link.href}
              component="a"
              href={link.href}
              variant="subtle"
              color="teal"
            >
              {link.label}
            </Button>
          ))}
        </Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />
      </Group>

      <Drawer
        opened={opened}
        onClose={close}
        title="Navigation"
        padding="md"
        size="xs"
        hiddenFrom="sm"
      >
        <Stack>
          {links.map((link) => (
            <Button
              key={link.href}
              component="a"
              href={link.href}
              variant="light"
              color="teal"
              onClick={close}
            >
              {link.label}
            </Button>
          ))}
        </Stack>
      </Drawer>
    </Box>
  );
};

export default Navbar;

import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

interface NavLink {
  name: string;
  path: string;
}

const Links: NavLink[] = [
  { name: "Home", path: "/" },
  { name: "Matches", path: "/matches" },
];

const Navbar: React.FC = () => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <Box bg="gray.900" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box fontWeight="bold" color="white">
          Football Stats
        </Box>
        <HStack>
          {Links.map((link) => (
            <RouterLink to={link.path} key={link.name}>
              <Button variant="ghost" color="white">
                {link.name}
              </Button>
            </RouterLink>
          ))}
        </HStack>
        <IconButton
          size="md"
          // icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: "none" }}
          onClick={open ? onClose : onOpen}
          color="white"
        />
      </Flex>
      {open && (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as="nav">
            {Links.map((link) => (
              <RouterLink to={link.path} key={link.name}>
                <Button variant="ghost" color="white">
                  {link.name}
                </Button>
              </RouterLink>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default Navbar;

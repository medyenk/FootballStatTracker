import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  Button,
} from "@chakra-ui/react";

interface NavLink {
  name: string;
  path: string;
}

const Links: NavLink[] = [{ name: "Home", path: "/" }];

const Navbar: React.FC = () => {
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
      </Flex>
    </Box>
  );
};

export default Navbar;

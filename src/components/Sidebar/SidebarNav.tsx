import { Stack } from "@chakra-ui/react";
import { RiBookReadLine, RiHomeLine } from "react-icons/ri";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function SidebarNav() {
  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="GERAL">
        <NavLink icon={RiHomeLine} href="/home">
          Home
        </NavLink>
        <NavLink icon={RiBookReadLine} href="/books">
          Livros
        </NavLink>
      </NavSection>
    </Stack>
  );
}

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  IconButton,
} from "@chakra-ui/react";
import { Hamburger } from "../../icons";

export default function MenuBtn() {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<Hamburger />}
        variant="outline"
      />
      <MenuList>
        <MenuItem icon={<></>} command="⌘T">
          New Tab
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

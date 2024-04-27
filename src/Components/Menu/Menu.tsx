import {
  Button,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { Hamburger } from "../../icons";

export default function Menu() {
  return (
    <IconButton
      aria-label={"menu"}
      icon={<Hamburger />}
      size="sm"
      fontSize="xs"
      transition={"none"}
    />
  );
}

<Popover>
  <PopoverTrigger>
    <Button>Trigger</Button>
  </PopoverTrigger>
  <PopoverContent>
    <PopoverArrow />
  </PopoverContent>
</Popover>;

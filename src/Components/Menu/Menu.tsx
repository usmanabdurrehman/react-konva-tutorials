import { IconButton } from "@chakra-ui/react";
import React from "react";
import { Hamburger } from "../../icons";

export default function Menu() {
  return (
    <IconButton
      aria-label={"menu"}
      icon={<Hamburger />}
      size="md"
      fontSize="xs"
      transition={"none"}
    />
  );
}

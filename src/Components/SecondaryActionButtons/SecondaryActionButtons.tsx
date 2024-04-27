import { Button, ButtonGroup, Flex, IconButton } from "@chakra-ui/react";
import { Maximize, Minimize, Redo, Undo } from "../../icons";

export default function SecondaryActionButtons() {
  return (
    <Flex gap={2}>
      <ButtonGroup size="sm" isAttached variant="solid">
        <IconButton aria-label="minimize" icon={<Minimize />} />
        <Button color="#888">100%</Button>
        <IconButton aria-label="maximize" icon={<Maximize />} />
      </ButtonGroup>
      <ButtonGroup size="sm" isAttached variant="solid">
        <IconButton aria-label="undo" icon={<Undo />} />
        <IconButton aria-label="redo" icon={<Redo />} />
      </ButtonGroup>
    </Flex>
  );
}

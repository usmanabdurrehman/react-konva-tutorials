import { Button, ButtonGroup, Flex, IconButton } from "@chakra-ui/react";
import { SecondaryAction } from "../../constants";
import { Maximize, Minimize, Redo, Undo } from "../../icons";

interface SecondaryActionButtonsProps {
  onActionChange: (action: SecondaryAction) => void;
}

export default function SecondaryActionButtons({
  onActionChange,
}: SecondaryActionButtonsProps) {
  return (
    <Flex gap={2}>
      <ButtonGroup size="sm" isAttached variant="solid">
        <IconButton
          onClick={() => onActionChange(SecondaryAction.ZoomOut)}
          aria-label="minimize"
          icon={<Minimize />}
        />
        <Button
          color="#888"
          onClick={() => onActionChange(SecondaryAction.ResetZoom)}
        >
          100%
        </Button>
        <IconButton
          aria-label="maximize"
          icon={<Maximize />}
          onClick={() => onActionChange(SecondaryAction.ZoomIn)}
        />
      </ButtonGroup>
      <ButtonGroup size="sm" isAttached variant="solid">
        <IconButton
          aria-label="undo"
          icon={<Undo />}
          onClick={() => onActionChange(SecondaryAction.Undo)}
        />
        <IconButton
          aria-label="redo"
          icon={<Redo />}
          onClick={() => onActionChange(SecondaryAction.Redo)}
        />
      </ButtonGroup>
    </Flex>
  );
}

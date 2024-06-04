import { Box, Flex } from "@chakra-ui/react";
import { DrawAction, PAINT_DRAW_OPTIONS } from "../../constants";
import { IconButton } from "../IconButton";

interface ActionButtonProps {
  onActionChange: React.Dispatch<React.SetStateAction<DrawAction>>;
  selectedAction: DrawAction | undefined;
}

export default function ActionButtons({
  onActionChange,
  selectedAction,
}: ActionButtonProps) {
  return (
    <Box
      display="inline-block"
      boxShadow="md"
      border="1px solid #eee"
      borderRadius="md"
      p={1}
      bg="white"
    >
      <Flex gap={2}>
        {PAINT_DRAW_OPTIONS.map(({ label, icon, id, keyBind }) => (
          <IconButton
            label={label}
            icon={icon}
            isSelected={selectedAction === id}
            keyBind={keyBind}
            onClick={() => onActionChange(id)}
            baseBg="none"
          />
        ))}
      </Flex>
    </Box>
  );
}

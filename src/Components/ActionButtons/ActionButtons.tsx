import { Box, Flex } from "@chakra-ui/react";
import { PAINT_DRAW_OPTIONS } from "../ExcaliDraw/ExcaliDraw.constants";
import { IconButton } from "../IconButton";

export default function ActionButtons() {
  return (
    <Box
      display="inline-block"
      boxShadow="md"
      border="1px solid #eee"
      borderRadius="md"
      p={1}
    >
      <Flex gap={1}>
        {PAINT_DRAW_OPTIONS.map(({ label, icon, id, keyBind }) => (
          <IconButton
            label={label}
            icon={icon}
            isSelected={false}
            keyBind={keyBind}
            onClick={() => {}}
          />
        ))}
      </Flex>
    </Box>
  );
}

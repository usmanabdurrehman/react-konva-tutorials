import { Box, Flex } from "@chakra-ui/react";
import { PAINT_DRAW_OPTIONS } from "../../constants";
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
      <Flex gap={2}>
        {PAINT_DRAW_OPTIONS.map(({ label, icon, id, keyBind }) => (
          <IconButton
            label={label}
            icon={icon}
            isSelected={false}
            keyBind={keyBind}
            onClick={() => {}}
            baseBg="none"
          />
        ))}
      </Flex>
    </Box>
  );
}

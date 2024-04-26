import { Box, IconButton as ChakraIconButton, Text } from "@chakra-ui/react";

export const IconButton = ({
  icon,
  isSelected,
  keyBind,
  label,
  onClick,
}: {
  icon: JSX.Element;
  isSelected?: boolean;
  keyBind?: string;
  label: string;
  onClick?: () => void;
}) => {
  return (
    <Box pos="relative">
      <ChakraIconButton
        aria-label={label}
        title={label}
        icon={icon}
        size="md"
        fontSize="xs"
        bg={isSelected ? "#e0dfff" : "none"}
        color={isSelected ? "#4440bf" : "black"}
        transition={"none"}
        onClick={onClick}
      />
      {keyBind && (
        <Text
          fontSize="x-small"
          pos="absolute"
          bottom="2px"
          right="3px"
          color={isSelected ? "#4440bf" : "#aaa"}
        >
          {keyBind}
        </Text>
      )}
    </Box>
  );
};

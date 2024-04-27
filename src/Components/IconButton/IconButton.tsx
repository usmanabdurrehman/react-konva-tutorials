import { Box, IconButton as ChakraIconButton, Text } from "@chakra-ui/react";

export const IconButton = ({
  icon,
  isSelected,
  keyBind,
  label,
  onClick,
  baseBg,
}: {
  icon: JSX.Element;
  isSelected?: boolean;
  keyBind?: string;
  label: string;
  onClick?: () => void;
  baseBg?: string;
}) => {
  return (
    <Box pos="relative">
      <ChakraIconButton
        aria-label={label}
        title={label}
        icon={icon}
        size="sm"
        fontSize="xs"
        bg={isSelected ? "#e0dfff" : baseBg}
        color={isSelected ? "#4440bf" : "black"}
        transition={"none"}
        onClick={onClick}
      />
      {keyBind && (
        <Text
          fontSize="xx-small"
          pos="absolute"
          bottom="1px"
          right="1px"
          color={isSelected ? "#4440bf" : "#aaa"}
        >
          {keyBind}
        </Text>
      )}
    </Box>
  );
};

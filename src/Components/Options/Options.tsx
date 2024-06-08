import { Box, Flex, Text } from "@chakra-ui/react";
import { NodeConfig } from "konva/lib/Node";
import { LayerOptions, LAYER_OPTIONS } from "../../constants";
import { IconButton } from "../IconButton";

interface OptionsProps {
  onLayerChange: (action: LayerOptions) => void;
  onShapeAction: (payload: any) => void;
  nodeAttrs: NodeConfig | undefined;
}

export default function Options({
  onLayerChange,
  onShapeAction,
  nodeAttrs,
}: OptionsProps) {
  return (
    <Box
      borderRadius={"md"}
      width="200px"
      border="1px solid #ddd"
      p={3}
      bg="white"
    >
      <Text fontSize="x-small">Stroke</Text>
      <Flex mt={1} gap={1}>
        {["#1e1e1e", "#e03131", "#2f9e44", "#1971c2", "#f08c00"].map(
          (color) => (
            <Box
              h={6}
              w={6}
              borderRadius="md"
              bg={color}
              cursor="pointer"
              onClick={() => onShapeAction({ stroke: color })}
            ></Box>
          )
        )}
      </Flex>

      <Text fontSize="x-small" mt={3}>
        Background
      </Text>
      <Flex mt={1} gap={1}>
        {["#1e1e1e", "#ffc9c9", "#b2f2bb", "#a5d8ff", "#ffec99"].map(
          (color) => (
            <Box
              h={6}
              w={6}
              borderRadius="md"
              bg={color}
              cursor="pointer"
              onClick={() => onShapeAction({ fill: color })}
            ></Box>
          )
        )}
      </Flex>

      <Text fontSize="x-small" mt={3}>
        Fill
      </Text>
      <Text fontSize="x-small" mt={3}>
        Layers
      </Text>
      <Flex mt={1} gap={2}>
        {LAYER_OPTIONS.map(({ id, label, icon }) => (
          <IconButton
            label={label}
            icon={icon}
            onClick={() => onLayerChange(id)}
          />
        ))}
      </Flex>
    </Box>
  );
}

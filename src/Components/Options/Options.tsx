import {
  Box,
  Flex,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Text,
} from "@chakra-ui/react";
import { Node, NodeConfig } from "konva/lib/Node";
import {
  DrawAction,
  LayerOptions,
  LAYER_OPTIONS,
  MiscActions,
  MISC_ACTIONS_OPTIONS,
  ShapeEdges,
  SHAPE_EDGES_OPTIONS,
  SHAPE_FILL_OPTIONS,
  StrokeStyle,
  StrokeWidth,
  STROKE_STYLE_OPTIONS,
  STROKE_WIDTH_OPTIONS,
} from "../../constants";
import { IconButton } from "../IconButton";

interface OptionsProps {
  onAction: (action: MiscActions) => void;
  onShapeAction: (payload: any) => void;
  onLayerChange: (action: LayerOptions) => void;
  nodeAttrs: NodeConfig | undefined;
  type: DrawAction;
}

export default function Options({
  onAction,
  onShapeAction,
  nodeAttrs,
  type,
  onLayerChange,
}: OptionsProps) {
  const isShape = [
    DrawAction.Circle,
    DrawAction.Diamond,
    DrawAction.Rectangle,
  ].includes(type);

  const hasEdges = [DrawAction.Diamond, DrawAction.Rectangle].includes(type);

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
      {isShape && (
        <>
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
        </>
      )}
      <Text fontSize="x-small" mt={3}>
        Fill
      </Text>
      {/* TODO: Make SVGs for patterns in illustrators and make image with those svgs maybe*/}
      <Flex mt={1} gap={2}>
        {SHAPE_FILL_OPTIONS.map(({ id, label, icon }) => (
          <IconButton label={label} icon={icon} />
        ))}
      </Flex>
      <Text fontSize="x-small" mt={3}>
        Stroke Width
      </Text>
      <Flex mt={1} gap={2}>
        {STROKE_WIDTH_OPTIONS.map(({ id, label, icon }) => (
          <IconButton
            label={label}
            icon={icon}
            isSelected={id === (nodeAttrs?.strokeWidth || StrokeWidth.Bold)}
            onClick={() => onShapeAction({ strokeWidth: id })}
          />
        ))}
      </Flex>
      <Text fontSize="x-small" mt={3}>
        Stroke Style
      </Text>
      <Flex mt={1} gap={2}>
        {STROKE_STYLE_OPTIONS.map(({ id, label, icon }) => (
          <IconButton
            label={label}
            icon={icon}
            isSelected={
              id === (nodeAttrs?.dash?.join(" ") || StrokeStyle.Solid)
            }
            onClick={() => onShapeAction({ dash: id.split(" ") })}
          />
        ))}
      </Flex>
      {hasEdges && (
        <>
          <Text fontSize="x-small" mt={3}>
            Edges
          </Text>
          <Flex mt={1} gap={2}>
            {SHAPE_EDGES_OPTIONS.map(({ id, label, icon }) => (
              <IconButton
                label={label}
                icon={icon}
                isSelected={
                  id === (nodeAttrs?.cornerRadius || ShapeEdges.Sharp)
                }
                onClick={() => onShapeAction({ cornerRadius: id })}
              />
            ))}
          </Flex>
        </>
      )}
      <Text fontSize="x-small" mt={3}>
        Opacity
      </Text>
      <RangeSlider
        mt={1}
        max={1}
        min={0}
        aria-label={["min", "max"]}
        defaultValue={[1]}
        borderRadius="md"
        step={0.1}
        onChange={(opacity) => onShapeAction({ opacity })}
      >
        <RangeSliderTrack h={2} borderRadius="md">
          <RangeSliderFilledTrack bg="gray" />
        </RangeSliderTrack>
        <RangeSliderThumb index={0} bg="gray" />
      </RangeSlider>
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
      <Text fontSize="x-small" mt={3}>
        Actions
      </Text>
      <Flex mt={1} gap={2}>
        {MISC_ACTIONS_OPTIONS.map(({ id, label, icon }) => (
          <IconButton label={label} icon={icon} onClick={() => onAction(id)} />
        ))}
      </Flex>
    </Box>
  );
}

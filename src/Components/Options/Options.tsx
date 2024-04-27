import {
  Box,
  Flex,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Text,
} from "@chakra-ui/react";
import {
  MISC_ACTIONS_OPTIONS,
  SHAPE_EDGES_OPTIONS,
  SHAPE_FILL_OPTIONS,
  STROKE_STYLE_OPTIONS,
  STROKE_WIDTH_OPTIONS,
} from "../../constants";
import { IconButton } from "../IconButton";

export default function Options() {
  return (
    <Box borderRadius={"md"} width="200px" border="1px solid #ddd" p={3}>
      <Text fontSize="x-small">Stroke</Text>
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
          <IconButton label={label} icon={icon} />
        ))}
      </Flex>
      <Text fontSize="x-small" mt={3}>
        Stroke Style
      </Text>
      <Flex mt={1} gap={2}>
        {STROKE_STYLE_OPTIONS.map(({ id, label, icon }) => (
          <IconButton label={label} icon={icon} />
        ))}
      </Flex>
      <Text fontSize="x-small" mt={3}>
        Edges
      </Text>
      <Flex mt={1} gap={2}>
        {SHAPE_EDGES_OPTIONS.map(({ id, label, icon }) => (
          <IconButton label={label} icon={icon} />
        ))}
      </Flex>
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
      >
        <RangeSliderTrack h={2} borderRadius="md">
          <RangeSliderFilledTrack bg="gray" />
        </RangeSliderTrack>
        <RangeSliderThumb index={0} bg="gray" />
      </RangeSlider>
      <Text fontSize="x-small" mt={3}>
        Actions
      </Text>
      <Flex mt={1} gap={2}>
        {MISC_ACTIONS_OPTIONS.map(({ id, label, icon }) => (
          <IconButton label={label} icon={icon} />
        ))}
      </Flex>
    </Box>
  );
}

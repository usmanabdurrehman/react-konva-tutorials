import { Box, Flex } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { ActionButtons } from "../ActionButtons";
import { Menu } from "../Menu";
import { Options } from "../Options";
import { SecondaryActionButtons } from "../SecondaryActionButtons";

interface ExcaliDrawProps {}

export const ExcaliDraw: React.FC<ExcaliDrawProps> = React.memo(
  function ExcaliDraw({}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<any>(null);

    console.log({ height: containerRef?.current?.offsetHeight });

    useEffect(() => {
      if (containerRef.current) {
        stageRef?.current?.width(containerRef.current.offsetWidth);
        stageRef?.current?.height(containerRef.current.offsetHeight);
      }
    }, [containerRef]);

    return (
      <Box ref={containerRef} pos="relative" height="100vh" width="100vw">
        <Flex
          alignItems={"center"}
          justifyContent="space-between"
          p={4}
          pos="absolute"
          top="10px"
          width="100%"
          zIndex={1}
        >
          <Menu />
          <ActionButtons />
          <Box />
        </Flex>
        <Box zIndex={1} left={4} pos="absolute" top="90px">
          <Options />
        </Box>
        <Box zIndex={1} left={4} pos="absolute" bottom="20px">
          <SecondaryActionButtons />
        </Box>

        <Stage ref={stageRef}>
          <Layer>
            {/* <Rect
              height={100}
              width={100}
              x={300}
              y={300}
              stroke="black"
              cornerRadius={12}
              fill="yellow"
              opacity={0.5}
              draggable
            /> */}
          </Layer>
        </Stage>
      </Box>
    );
  }
);

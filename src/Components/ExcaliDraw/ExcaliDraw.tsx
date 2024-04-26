import { Box, Flex } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { MenuDown } from "react-bootstrap-icons";
import { Stage } from "react-konva";
import { ActionButtons } from "../ActionButtons";
import { IconButton } from "../IconButton";
import { Menu } from "../Menu";
import { PAINT_DRAW_OPTIONS } from "./ExcaliDraw.constants";

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

        <Stage ref={stageRef}></Stage>
      </Box>
    );
  }
);

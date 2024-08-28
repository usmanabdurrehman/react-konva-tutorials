import { Box, Flex, IconButton } from "@chakra-ui/react";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Stage, Layer, Transformer, Line } from "react-konva";
import { DrawAction, DRAW_OPTIONS } from "../../constants";
import { getNumericVal, getRelativePointerPosition } from "../../utilities";
import { v4 as uuidv4 } from "uuid";
import { Stage as StageType } from "konva/lib/Stage";
import { Transformer as TransformerType } from "konva/lib/shapes/Transformer";
import Crown from "../Crown/Crown";
import { STROKE_COLOR, SCRIBBLE_BG } from "../../constants";

interface DrawProps {}

export const Draw: React.FC<DrawProps> = React.memo(function Draw({}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const stageRef = useRef<StageType | null>(null);

  const transformerRef = useRef<TransformerType>(null);

  const [drawAction, setDrawAction] = useState<DrawAction>(DrawAction.Crown);

  const [isDraggable, setIsDraggable] = useState(false);

  const [currentlyDrawnShape, setCurrentlyDrawnShape] = useState<NodeConfig>();
  const [drawings, setDrawings] = useState<NodeConfig[]>([]);

  const isPaintRef = useRef(false);

  const [{ viewWidth, viewHeight }, setViewMeasures] = useState<{
    viewHeight: number | undefined;
    viewWidth: number | undefined;
  }>({
    viewHeight: undefined,
    viewWidth: undefined,
  });

  useEffect(() => {
    if (containerRef.current) {
      setViewMeasures({
        viewHeight: containerRef.current.offsetHeight,
        viewWidth: containerRef.current.offsetWidth,
      });
    }
  }, [containerRef]);

  const onStageMouseUp = () => {
    isPaintRef.current = false;

    if (currentlyDrawnShape)
      setDrawings((prevDrawings) => [...prevDrawings, currentlyDrawnShape]);
    setCurrentlyDrawnShape(undefined);
  };

  const [currentSelectedShape, setCurrentSelectedShape] = useState<{
    node: Node<NodeConfig>;
    attrs?: NodeConfig;
  }>();

  const deSelect = useCallback(() => {
    transformerRef?.current?.nodes([]);
    setIsDraggable(false);
    setCurrentSelectedShape(undefined);
  }, []);

  const checkDeselect = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const clickedOnEmpty = e.target === stageRef?.current;
      if (clickedOnEmpty) {
        deSelect();
      }
    },
    [stageRef, deSelect]
  );

  const onStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    checkDeselect(e);
    const stage = stageRef?.current;
    if (e.evt.button !== 0 || !stage) return;
    const id = uuidv4();

    const pos = getRelativePointerPosition(stage);
    const x = getNumericVal(pos?.x);
    const y = getNumericVal(pos?.y);

    isPaintRef.current = true;

    switch (drawAction) {
      case DrawAction.Crown: {
        setCurrentlyDrawnShape({
          id,
          x,
          y,
          height: 1,
          width: 1,
          name: DrawAction.Crown,
        });
        break;
      }
      case DrawAction.Scribble: {
        setCurrentlyDrawnShape({
          id,
          points: [x, y, x, y],
          name: DrawAction.Scribble,
          stroke: STROKE_COLOR,
          fill: SCRIBBLE_BG,
        });
        break;
      }
    }
  };

  const onStageMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    const stage = stageRef?.current;
    if (e.evt.button !== 0 || !stage) return;

    const pos = getRelativePointerPosition(stage);
    const x = getNumericVal(pos?.x);
    const y = getNumericVal(pos?.y);

    if (!isPaintRef.current) return;

    switch (drawAction) {
      case DrawAction.Crown: {
        setCurrentlyDrawnShape((prevCurrentlyDrawnShape) => ({
          ...prevCurrentlyDrawnShape,
          height: y - (prevCurrentlyDrawnShape?.y || 0),
          width: x - (prevCurrentlyDrawnShape?.x || 0),
        }));
        break;
      }
      case DrawAction.Scribble: {
        setCurrentlyDrawnShape((prevCurrentlyDrawnShape) => ({
          ...prevCurrentlyDrawnShape,
          points: [...(prevCurrentlyDrawnShape?.points || []), x, y],
        }));
        break;
      }
    }
  };

  const onShapeClick = (e: KonvaEventObject<MouseEvent>) => {
    if (drawAction !== DrawAction.Select) return;
    const node = e.currentTarget;
    setCurrentSelectedShape({ node, attrs: node.attrs });

    setIsDraggable(true);
    transformerRef.current?.nodes([node]);
  };

  const shapeProps = {
    onClick: onShapeClick,
    draggable: isDraggable,
  };

  console.log({ drawings });

  return (
    <Box ref={containerRef} pos="relative" height="100vh" width="100vw">
      <Flex gap={2} pos="absolute" top={2} left={2} zIndex={1}>
        {DRAW_OPTIONS.map(({ id, icon }) => (
          <IconButton
            aria-label="Drawing Options"
            icon={icon}
            onClick={() => setDrawAction(id)}
            size="sm"
            colorScheme={id === drawAction ? "whatsapp" : undefined}
          />
        ))}
      </Flex>
      <Box height="100%" width="100%">
        <Stage
          ref={stageRef}
          onMouseUp={onStageMouseUp}
          onMouseDown={onStageMouseDown}
          onMouseMove={onStageMouseMove}
          height={viewHeight}
          width={viewWidth}
        >
          <Layer>
            {[...drawings, currentlyDrawnShape].map((drawing) => {
              if (drawing?.name === DrawAction.Crown) {
                return <Crown {...drawing} />;
              }
              if (drawing?.name === DrawAction.Scribble) {
                return (
                  <Line
                    {...drawing}
                    closed={drawing?.id !== currentlyDrawnShape?.id}
                  />
                );
              }
            })}
            <Transformer ref={transformerRef} rotateEnabled={false} />
          </Layer>
        </Stage>
      </Box>
    </Box>
  );
});

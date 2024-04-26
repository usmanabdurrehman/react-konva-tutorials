import { Box, Flex, IconButton } from "@chakra-ui/react";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { LineConfig } from "konva/lib/shapes/Line";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Stage, Layer, Transformer, Line } from "react-konva";
import {
  DrawAction,
  DRAW_OPTIONS,
  MULTI_POINT_LINE_BG,
  SCRIBBLE_BG,
  STROKE_COLOR,
} from "../../constants";
import { getNumericVal, getRelativePointerPosition } from "../../utilities";
import Crown from "../Crown/Crown";
import MultiPointLine from "../MultiPointLine/MultiPointLine";
import { v4 as uuidv4 } from "uuid";
import { Stage as StageType } from "konva/lib/Stage";
import { Transformer as TransformerType } from "konva/lib/shapes/Transformer";

interface DrawProps {}

export const Draw: React.FC<DrawProps> = React.memo(function Draw({}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const stageRef = useRef<StageType | null>(null);
  const isPaintRef = useRef(false);
  const isMultiPointRef = useRef(0);

  const transformerRef = useRef<TransformerType>(null);

  const [drawings, setDrawings] = useState<NodeConfig[]>([
    {
      name: DrawAction.MultiPointLine,
      x: 100,
      y: 100,
      points: [0, 0, 100, 100, 50, 150],
      fill: "blue",
      stroke: "yellow",
    },
  ]);
  const [currentlyDrawnShape, setCurrentlyDrawnShape] = useState<NodeConfig>();

  const [drawAction, setDrawAction] = useState<DrawAction>(DrawAction.Crown);

  const [isDraggable, setIsDraggable] = useState(false);

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
    if (isMultiPointRef.current) {
      return;
    }

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
    if (e.evt.button !== 0) return;
    const stage = stageRef?.current;
    const id = uuidv4();
    if (!stage) return;

    const pos = getRelativePointerPosition(stage);
    const x = getNumericVal(pos?.x);
    const y = getNumericVal(pos?.y);

    if (drawAction === DrawAction.MultiPointLine) {
      if (isMultiPointRef.current === 0) {
        setCurrentlyDrawnShape({
          id,
          points: [x, y],
          name: DrawAction.MultiPointLine,
          stroke: STROKE_COLOR,
          fill: MULTI_POINT_LINE_BG,
        });
        isMultiPointRef.current = (isMultiPointRef.current || 0) + 1;
      } else {
        if (
          isMultiPointRef.current >= 3 &&
          currentlyDrawnShape?.points?.[0] ===
            currentlyDrawnShape?.points?.at(-2) &&
          currentlyDrawnShape?.points?.[1] ===
            currentlyDrawnShape?.points?.at(-1)
        ) {
          if (currentlyDrawnShape)
            setDrawings((prevDrawings) => [
              ...prevDrawings,
              currentlyDrawnShape,
            ]);
          setCurrentlyDrawnShape(undefined);
          isMultiPointRef.current = 0;
        } else {
          setCurrentlyDrawnShape((prevLine: LineConfig) => ({
            ...prevLine,
            points: [...(prevLine?.points || []), x, y],
          }));
          isMultiPointRef.current = (isMultiPointRef.current || 0) + 1;
        }
      }

      return;
    }

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
    if (e.evt.button !== 0) return;
    const stage = stageRef?.current;
    if (!stage) return;

    const pos = getRelativePointerPosition(stage);
    const x = getNumericVal(pos?.x);
    const y = getNumericVal(pos?.y);

    if (isMultiPointRef.current && drawAction === DrawAction.MultiPointLine) {
      setCurrentlyDrawnShape((prevLine: LineConfig) => {
        const prevPoints = [...(prevLine?.points || [])];
        const pointsLength = isMultiPointRef.current;
        if (
          Math.abs(prevPoints?.[0] - x) < 7 &&
          Math.abs(prevPoints?.[1] - y) < 7
        ) {
          prevPoints[pointsLength * 2] = prevPoints?.[0];
          prevPoints[pointsLength * 2 + 1] = prevPoints?.[1];
        } else {
          prevPoints[pointsLength * 2] = x;
          prevPoints[pointsLength * 2 + 1] = y;
        }
        return { ...prevLine, points: prevPoints };
      });

      return;
    }

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
  const [isDragging, setIsDragging] = useState(false);

  const onDragEnd = (e: KonvaEventObject<MouseEvent>) => {
    if (drawAction !== DrawAction.Select) return;

    const node = e.target;
    setIsDragging(false);

    const x = node.x();
    const y = node.y();
    setDrawings((prevDrawings) =>
      prevDrawings.map((drawing) => {
        if (drawing.id === currentSelectedShape?.attrs?.id) {
          return { ...drawing, x, y };
        } else return drawing;
      })
    );
  };

  const onDragStart = () => {
    setIsDragging(true);
  };

  const shapeProps = {
    onClick: onShapeClick,
    draggable: isDraggable,
    onDragEnd,
    onDragStart,
  };

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
            {[...drawings, currentlyDrawnShape]
              .map((drawing) => {
                if (drawing?.name === DrawAction.Crown) {
                  return <Crown {...drawing} {...shapeProps} />;
                }
                if (drawing?.name === DrawAction.Scribble) {
                  return (
                    <Line
                      {...drawing}
                      closed={currentlyDrawnShape?.id !== drawing.id}
                      {...shapeProps}
                    />
                  );
                }
                if (drawing?.name === DrawAction.MultiPointLine) {
                  return (
                    <MultiPointLine
                      {...drawing}
                      onPointDrag={(updatePoints) => {
                        setDrawings((prevDrawings) =>
                          prevDrawings.map((drawing) =>
                            drawing.id === currentSelectedShape?.attrs?.id
                              ? {
                                  ...drawing,
                                  points: updatePoints(drawing?.points),
                                }
                              : drawing
                          )
                        );
                      }}
                      activatePoints={
                        currentlyDrawnShape?.id === drawing?.id ||
                        (currentSelectedShape?.attrs?.id === drawing?.id &&
                          !isDragging)
                      }
                      isSelected={
                        currentSelectedShape?.attrs?.id === drawing?.id
                      }
                      closed={currentlyDrawnShape?.id !== drawing.id}
                      {...shapeProps}
                    />
                  );
                }
                return null;
              })
              .filter((item) => !!item)}

            <Transformer ref={transformerRef} rotateEnabled={false} />
          </Layer>
        </Stage>
      </Box>
    </Box>
  );
});

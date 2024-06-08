import { Box, Flex } from "@chakra-ui/react";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Stage,
  Layer,
  Rect as KonvaRect,
  Circle as KonvaCircle,
  Line as KonvaLine,
  Arrow as KonvaArrow,
  Transformer,
} from "react-konva";
import { DrawAction, LayerOptions, SecondaryAction } from "../../constants";
import { getNumericVal, reorderArray } from "../../utilities";
import { ActionButtons } from "../ActionButtons";
import { Menu } from "../Menu";
import { Options } from "../Options";
import { SecondaryActionButtons } from "../SecondaryActionButtons";
import { v4 as uuidv4 } from "uuid";
import { ArrowConfig } from "konva/lib/shapes/Arrow";
import { LineConfig } from "konva/lib/shapes/Line";
import { CircleConfig } from "konva/lib/shapes/Circle";
import { RectConfig } from "konva/lib/shapes/Rect";

interface ExcaliDrawProps {}

export const ExcaliDraw: React.FC<ExcaliDrawProps> = React.memo(
  function ExcaliDraw({}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const currentShapeRef = useRef<string>();
    const isPaintRef = useRef(false);
    const stageRef = useRef<any>();

    const transformerRef = useRef<any>(null);

    const [{ x: stageX, y: stageY }, setStageXY] = useState({ x: 0, y: 0 });

    const [drawings, setDrawings] = useState<NodeConfig[]>([]);
    const [currentlyDrawnShape, setCurrentlyDrawnShape] =
      useState<NodeConfig>();

    const [drawAction, setDrawAction] = useState<DrawAction>(
      DrawAction.Scribble
    );

    const [currentSelectedShape, setCurrentSelectedShape] = useState<{
      type: DrawAction;
      id: string;
      node: Node<NodeConfig>;
      props?: NodeConfig;
    }>();

    const deSelect = useCallback(() => {
      transformerRef?.current?.nodes([]);
      setCurrentSelectedShape(undefined);
    }, []);

    const checkDeselect = useCallback(
      (e: KonvaEventObject<MouseEvent>) => {
        // This stopped working for some reason
        // const clickedOnEmpty = e.target === stageRef?.current?.find("#bg")?.[0];
        const clickedOnEmpty = e.target === stageRef?.current;
        if (clickedOnEmpty) {
          deSelect();
        }
      },
      [stageRef, deSelect]
    );

    const onStageMouseUp = useCallback(() => {
      isPaintRef.current = false;
      if (currentlyDrawnShape)
        setDrawings((prevDrawings) => [...prevDrawings, currentlyDrawnShape]);
      setCurrentlyDrawnShape(undefined);
    }, [currentlyDrawnShape, drawAction]);

    const updateCurrentDrawnShape = <T,>(updaterFn: (payload: T) => T) => {
      setCurrentlyDrawnShape((prevDrawnShape) => {
        return {
          ...(prevDrawnShape || {}),
          ...updaterFn(prevDrawnShape as T),
        };
      });
    };

    const onStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
      checkDeselect(e);
      const color = "#000";

      if (drawAction === DrawAction.Select) return;
      isPaintRef.current = true;
      const stage = stageRef?.current;
      const pos = stage?.getPointerPosition();
      const x = getNumericVal(pos?.x) - stageX;
      const y = getNumericVal(pos?.y) - stageY;
      const id = uuidv4();
      currentShapeRef.current = id;

      const shouldUpdateCanvasHistory = [
        DrawAction.Arrow,
        DrawAction.Circle,
        DrawAction.Rectangle,
        DrawAction.Scribble,
        DrawAction.Text,
      ].includes(drawAction);

      switch (drawAction) {
        case DrawAction.Scribble:
          updateCurrentDrawnShape<LineConfig>(() => ({
            id,
            points: [x, y, x, y],

            scaleX: 1,
            scaleY: 1,
            stroke: color,
            name: DrawAction.Scribble,
          }));

          break;
        case DrawAction.Circle: {
          updateCurrentDrawnShape<CircleConfig>(() => ({
            id,
            radius: 1,
            x,
            y,

            scaleX: 1,
            scaleY: 1,
            stroke: color,
            name: DrawAction.Circle,
          }));
          break;
        }

        case DrawAction.Rectangle:
        case DrawAction.Diamond: {
          updateCurrentDrawnShape<RectConfig>(() => ({
            height: 1,
            width: 1,
            x,
            y,

            scaleX: 1,
            scaleY: 1,
            stroke: color,
            id,
            rotationDeg: drawAction === DrawAction.Diamond ? 45 : 0,
            name: DrawAction.Rectangle,
          }));
          break;
        }
        case DrawAction.Arrow: {
          updateCurrentDrawnShape<ArrowConfig>(() => ({
            id,
            points: [x, y, x, y],
            fill: color,
            stroke: color,
            scaleX: 1,
            scaleY: 1,
            name: DrawAction.Arrow,
          }));
          break;
        }
      }
    };

    const onStageMouseMove = () => {
      if (drawAction === DrawAction.Select || !isPaintRef.current) return;

      const stage = stageRef?.current;
      const pos = stage?.getPointerPosition();
      const x = getNumericVal(pos?.x) - stageX;
      const y = getNumericVal(pos?.y) - stageY;

      switch (drawAction) {
        case DrawAction.Scribble: {
          updateCurrentDrawnShape<LineConfig>((prevScribble) => ({
            points: [...(prevScribble.points || []), x, y],
          }));

          break;
        }
        case DrawAction.Circle: {
          updateCurrentDrawnShape<CircleConfig>((prevCircle) => ({
            radius:
              ((x - (prevCircle.x || 0)) ** 2 +
                (y - (prevCircle.y || 0)) ** 2) **
              0.5,
          }));

          break;
        }
        case DrawAction.Rectangle: {
          updateCurrentDrawnShape<RectConfig>((prevRectangle) => ({
            height: y - (prevRectangle.y || 0),
            width: x - (prevRectangle.x || 0),
          }));
          break;
        }
        case DrawAction.Diamond: {
          break;
        }
        case DrawAction.Arrow: {
          updateCurrentDrawnShape<ArrowConfig>((prevArrow) => ({
            points: [prevArrow?.points[0], prevArrow?.points[1], x, y],
          }));

          break;
        }
      }
    };

    const onShapeClick = (e: KonvaEventObject<MouseEvent>) => {
      if (drawAction !== DrawAction.Select) return;
      const currentTarget = e.currentTarget;

      const type = currentTarget?.attrs?.name;
      const id = currentTarget?.attrs?.id;
      setCurrentSelectedShape({
        type,
        id,
        node: currentTarget,
        props: drawings?.find((record) => record.id === id),
      });
      transformerRef?.current?.node(currentTarget);
    };

    const isDraggable = drawAction === DrawAction.Select;

    let mouseCursor;
    switch (drawAction) {
      case DrawAction.Move: {
        mouseCursor = "grab";
        break;
      }
      case DrawAction.ZoomIn: {
        mouseCursor = "zoom-in";
        break;
      }
      case DrawAction.ZoomOut: {
        mouseCursor = "zoom-out";
        break;
      }
    }

    const getShapeProps = useCallback(
      (shape: NodeConfig) => ({
        key: shape.id,
        id: shape.id,
        onClick: onShapeClick,
        scaleX: shape.scaleX,
        scaleY: shape.scaleY,
        draggable: isDraggable,
      }),
      [onShapeClick, isDraggable]
    );

    useEffect(() => {
      if (containerRef.current) {
        stageRef?.current?.width(containerRef.current.offsetWidth);
        stageRef?.current?.height(containerRef.current.offsetHeight);
      }
    }, [containerRef]);

    const onSecondaryActionChange = useCallback((action: SecondaryAction) => {},
    []);

    return (
      <Box ref={containerRef} pos="relative" height="100vh" width="100vw">
        <Flex
          alignItems={"center"}
          justifyContent="space-between"
          pos="absolute"
          top="20px"
          width="100%"
          zIndex={1}
          pl={4}
        >
          <Menu />
          <ActionButtons
            onActionChange={setDrawAction}
            selectedAction={drawAction}
          />
          <Box />
        </Flex>
        {currentSelectedShape && (
          <Box zIndex={1} left={4} pos="absolute" top="90px">
            <Options
              nodeAttrs={currentSelectedShape.props}
              onShapeAction={(payload) => {
                setCurrentSelectedShape((prevSelectedShape) => ({
                  ...currentSelectedShape,
                  props: { ...(currentSelectedShape || {})?.props, ...payload },
                }));

                setDrawings((prevRecords) =>
                  prevRecords.map((record) =>
                    record.id === currentSelectedShape?.id
                      ? { ...record, ...payload }
                      : record
                  )
                );
              }}
              onLayerChange={(action) => {
                const drawingIndex = drawings?.findIndex(
                  (drawing) => drawing.id === currentSelectedShape?.id
                );
                switch (action) {
                  case LayerOptions.SendToBack: {
                    setDrawings((drawings) =>
                      reorderArray(drawings, drawingIndex, 0)
                    );
                    break;
                  }
                  case LayerOptions.SendBackward: {
                    setDrawings((drawings) =>
                      reorderArray(drawings, drawingIndex, drawingIndex - 1)
                    );
                    break;
                  }
                  case LayerOptions.SendForward: {
                    setDrawings((drawings) =>
                      reorderArray(drawings, drawingIndex, drawingIndex + 1)
                    );
                    break;
                  }
                  case LayerOptions.SendToFront: {
                    setDrawings((drawings) =>
                      reorderArray(drawings, drawingIndex, drawings?.length - 1)
                    );
                    break;
                  }
                }
              }}
            />
          </Box>
        )}
        <Box zIndex={1} left={4} pos="absolute" bottom="20px">
          <SecondaryActionButtons onActionChange={onSecondaryActionChange} />
        </Box>

        <Stage
          ref={stageRef}
          onMouseUp={onStageMouseUp}
          onMouseDown={onStageMouseDown}
          onMouseMove={onStageMouseMove}
        >
          <Layer>
            <KonvaRect
              {...{ x: 205, y: 193, height: 140, width: 137 }}
              stroke="#000"
              fill="red"
              draggable
            />
            <KonvaCircle
              {...{ x: 357, y: 238, radius: 84 }}
              stroke="#000"
              fill="green"
              draggable
            />
            <KonvaRect
              {...{ x: 232, y: 255, height: 174, width: 167 }}
              stroke="#000"
              fill="blue"
              draggable
            />
            {[...drawings, currentlyDrawnShape].map((drawing) => {
              if (drawing?.name === DrawAction.Rectangle) {
                return <KonvaRect {...drawing} {...getShapeProps(drawing)} />;
              }
              if (drawing?.name === DrawAction.Circle) {
                return <KonvaCircle {...drawing} {...getShapeProps(drawing)} />;
              }
              if (drawing?.name === DrawAction.Scribble) {
                return (
                  <KonvaLine
                    lineCap="round"
                    lineJoin="round"
                    {...drawing}
                    {...getShapeProps(drawing)}
                  />
                );
              }
              if (drawing?.name === DrawAction.Arrow) {
                return (
                  <KonvaArrow
                    {...(drawing as ArrowConfig)}
                    {...getShapeProps(drawing)}
                  />
                );
              }
              return null;
            })}
            <Transformer ref={transformerRef} />
          </Layer>
        </Stage>
      </Box>
    );
  }
);

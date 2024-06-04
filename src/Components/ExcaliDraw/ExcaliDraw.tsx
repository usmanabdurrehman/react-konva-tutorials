import { Box, Flex } from "@chakra-ui/react";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Stage,
  Layer,
  Rect as KonvaRect,
  Image as KonvaImage,
  Circle as KonvaCircle,
  Line as KonvaLine,
  Arrow as KonvaArrow,
  Text as KonvaText,
  Transformer,
} from "react-konva";
import {
  CanvasAction,
  DrawAction,
  MiscActions,
  SCALE_BY,
  SecondaryAction,
} from "../../constants";
import { Arrow, Circle, Rectangle, Scribble, Shape, Text } from "../../types";
import { downloadURI, getNumericVal } from "../../utilities";
import { ActionButtons } from "../ActionButtons";
import { Menu } from "../Menu";
import { Options } from "../Options";
import { SecondaryActionButtons } from "../SecondaryActionButtons";
import { v4 as uuidv4 } from "uuid";
import { useKeyBindings, useStoreProgress } from "../../hooks";
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

    const [scribbles, setScribbles] = useState<Scribble[]>([]);
    const [rectangles, setRectangles] = useState<Rectangle[]>([]);
    const [circles, setCircles] = useState<Circle[]>([]);
    const [arrows, setArrows] = useState<ArrowConfig[]>([]);
    const [texts, setTexts] = useState<Text[]>([]);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [currentlyDrawnShape, setCurrentlyDrawnShape] =
      useState<NodeConfig>();

    const [textPosition, setTextPosition] = useState<{
      x: number;
      y: number;
    }>();
    const [editText, setEditText] = useState("");

    const [canvasHistory, setCanvasHistory] = useState<
      {
        type: CanvasAction;
        drawAction: DrawAction | undefined;
        payload: any;
      }[]
    >([]);

    const [color, setColor] = useState("#000");
    const [drawAction, setDrawAction] = useState<DrawAction>(
      DrawAction.Scribble
    );
    const inputRef = useRef<HTMLInputElement>(null);

    const onBlurTextField = useCallback(() => {
      setTextPosition(undefined);
      const id = currentShapeRef?.current;
      if (!id || !textPosition) return;
      setTexts((prevTexts) => [
        ...prevTexts,
        {
          id,
          x: textPosition?.x,
          y: textPosition?.y,
          text: editText,
          color: color,
          scaleX: 1,
          scaleY: 1,
        },
      ]);
      setEditText("");
    }, [editText, color, textPosition]);

    const getSetterByType = useCallback((type: DrawAction | undefined) => {
      let setter: React.Dispatch<React.SetStateAction<any[]>> | undefined;
      switch (type) {
        case DrawAction.Rectangle:
          setter = setRectangles;
          break;
        case DrawAction.Circle:
          setter = setCircles;
          break;
        case DrawAction.Arrow:
          setter = setArrows;
          break;
        case DrawAction.Scribble:
          setter = setScribbles;
          break;
        case DrawAction.Text:
          setter = setTexts;
          break;
      }
      return { setter };
    }, []);

    const getRecordsByType = useCallback(
      (type: DrawAction | undefined) => {
        let records: any[] | undefined;
        switch (type) {
          case DrawAction.Rectangle:
            records = rectangles;
            break;
          case DrawAction.Circle:
            records = circles;
            break;
          case DrawAction.Arrow:
            records = arrows;
            break;
          case DrawAction.Scribble:
            records = scribbles;
            break;
          case DrawAction.Text:
            records = texts;
            break;
        }
        return records;
      },
      [arrows, circles, rectangles, scribbles]
    );

    const [currentSelectedShape, setCurrentSelectedShape] = useState<{
      type: DrawAction;
      id: string;
      node: Node<NodeConfig>;
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
      const { setter } = getSetterByType(drawAction);
      if (setter)
        setter((prevRecords) => [...prevRecords, currentlyDrawnShape]);
      setCurrentlyDrawnShape(undefined);
    }, [currentlyDrawnShape, drawAction]);

    const onStageMouseDown = useCallback(
      (e: KonvaEventObject<MouseEvent>) => {
        checkDeselect(e);

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

        shouldUpdateCanvasHistory &&
          setCanvasHistory((prevCanvasHistory) => [
            ...prevCanvasHistory,
            { type: CanvasAction.Add, drawAction, payload: { id } },
          ]);

        switch (drawAction) {
          case DrawAction.Text: {
            onBlurTextField();
            setTextPosition({ x, y });
            break;
          }
          case DrawAction.Scribble:
            setCurrentlyDrawnShape({
              id,
              points: [x, y, x, y],
              color,
              scaleX: 1,
              scaleY: 1,
              stroke: color,
              name: DrawAction.Scribble,
            } as LineConfig);

            break;
          case DrawAction.Circle: {
            setCurrentlyDrawnShape({
              id,
              radius: 1,
              x,
              y,
              color,
              scaleX: 1,
              scaleY: 1,
              stroke: color,
              name: DrawAction.Circle,
            } as CircleConfig);
            break;
          }

          case DrawAction.Rectangle:
          case DrawAction.Diamond: {
            setCurrentlyDrawnShape({
              height: 1,
              width: 1,
              x,
              y,
              color,
              scaleX: 1,
              scaleY: 1,
              stroke: color,
              id,
              rotationDeg: drawAction === DrawAction.Diamond ? 45 : 0,
              name: DrawAction.Rectangle,
            } as RectConfig);
            break;
          }
          case DrawAction.Arrow: {
            setCurrentlyDrawnShape({
              id,
              points: [x, y, x, y],
              fill: color,
              stroke: color,
              scaleX: 1,
              scaleY: 1,
              name: DrawAction.Arrow,
            });
            break;
          }
        }
      },
      [
        checkDeselect,
        drawAction,
        color,
        stageRef,
        stageX,
        stageY,
        onBlurTextField,
      ]
    );

    const onStageMouseMove = useCallback(() => {
      if (drawAction === DrawAction.Select || !isPaintRef.current) return;

      const stage = stageRef?.current;
      const id = currentShapeRef.current;
      const pos = stage?.getPointerPosition();
      const x = getNumericVal(pos?.x) - stageX;
      const y = getNumericVal(pos?.y) - stageY;

      switch (drawAction) {
        case DrawAction.Scribble: {
          setCurrentlyDrawnShape((prevScribble) => {
            if (!prevScribble) return undefined;
            return {
              ...prevScribble,
              points: [...(prevScribble as Scribble).points, x, y],
            };
          });

          break;
        }
        case DrawAction.Circle: {
          setCurrentlyDrawnShape((prevCircle) => {
            if (!prevCircle) return undefined;
            return {
              ...prevCircle,
              radius:
                ((x - (prevCircle as Circle).x) ** 2 +
                  (y - (prevCircle as Circle).y) ** 2) **
                0.5,
            };
          });
          break;
        }
        case DrawAction.Rectangle: {
          setCurrentlyDrawnShape((prevRectangle) => {
            if (!prevRectangle) return undefined;
            return {
              ...prevRectangle,
              height: y - (prevRectangle as Rectangle).y,
              width: x - (prevRectangle as Rectangle).x,
            };
          });
          break;
        }
        case DrawAction.Diamond: {
          break;
        }
        case DrawAction.Arrow: {
          setCurrentlyDrawnShape((prevArrow) => {
            if (!prevArrow) return undefined;
            return {
              ...prevArrow,
              points: [
                (prevArrow as Arrow)?.points[0],
                (prevArrow as Arrow)?.points[1],
                x,
                y,
              ],
            };
          });

          break;
        }
      }
    }, [drawAction, stageRef, stageX, stageY]);

    console.log({ currentlyDrawnShape });

    const onShapeClick = useCallback(
      (e: KonvaEventObject<MouseEvent>) => {
        if (drawAction !== DrawAction.Select) return;
        const currentTarget = e.currentTarget;
        setCurrentSelectedShape({
          type: currentTarget?.attrs?.name,
          id: currentTarget?.attrs?.id,
          node: currentTarget,
        });
        transformerRef?.current?.node(currentTarget);
      },
      [drawAction]
    );

    const isDraggable = drawAction === DrawAction.Select;
    const isStageDraggable = drawAction === DrawAction.Move;

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

    const onTransformShapeStart = useCallback(
      (e: KonvaEventObject<MouseEvent>) => {
        setCanvasHistory((prevCanvasHistory) => [
          ...prevCanvasHistory,
          {
            type: CanvasAction.Resize,
            drawAction: e.target.attrs.name,
            payload: {
              id: e.target.attrs.id,
              scaleX: e.target.attrs.scaleX,
              scaleY: e.target.attrs.scaleY,
            },
          },
        ]);
      },
      []
    );

    const onDragShapeStart = useCallback((e: KonvaEventObject<MouseEvent>) => {
      setCanvasHistory((prevCanvasHistory) => [
        ...prevCanvasHistory,
        {
          type: CanvasAction.Drag,
          drawAction: e.target.attrs.name,
          payload: {
            id: e.target.attrs.id,
            x: e.target.attrs.x,
            y: e.target.attrs.y,
          },
        },
      ]);
    }, []);

    const onUndoClick = useCallback(() => {
      const canvasHistoryPayload = [...canvasHistory];
      const lastAction = canvasHistoryPayload.pop();
      setCanvasHistory(canvasHistoryPayload);

      const { setter } = getSetterByType(lastAction?.drawAction);
      const id = lastAction?.payload?.id;
      if (!setter) return;
      switch (lastAction?.type) {
        case CanvasAction.Add: {
          transformerRef?.current?.nodes([]);
          setter((prevRecords) =>
            prevRecords.filter((prevRecord) => prevRecord.id !== id)
          );
          break;
        }
        case CanvasAction.Delete: {
          setter((prevRecords) => [
            ...prevRecords,
            lastAction?.payload?.record,
          ]);
          break;
        }
        case CanvasAction.Resize: {
          setter((prevRecords) =>
            prevRecords.map((prevRecord) =>
              prevRecord.id === id
                ? { ...prevRecord, ...lastAction?.payload }
                : prevRecord
            )
          );
          break;
        }
        case CanvasAction.Drag: {
          setter((prevRecords) =>
            prevRecords.map((prevRecord) =>
              prevRecord.id === id
                ? { ...prevRecord, ...lastAction?.payload }
                : prevRecord
            )
          );
          break;
        }
      }
    }, [canvasHistory, getSetterByType]);

    const onDeleteShape = useCallback(() => {
      const { setter } = getSetterByType(currentSelectedShape?.type);
      const records = getRecordsByType(currentSelectedShape?.type);
      const record = records?.find(
        (record) => record.id === currentSelectedShape?.id
      );
      setCanvasHistory((prevCanvasHistory) => {
        return [
          ...prevCanvasHistory,
          {
            type: CanvasAction.Delete,
            drawAction: currentSelectedShape?.type,
            payload: { id: currentSelectedShape?.id, record },
          },
        ];
      });

      transformerRef?.current?.nodes([]);
      setter &&
        setter((prevRecords) =>
          prevRecords.filter((record) => record.id !== currentSelectedShape?.id)
        );
      setCurrentSelectedShape(undefined);
    }, [getSetterByType, getRecordsByType, currentSelectedShape]);

    const onClear = useCallback(() => {
      setRectangles([]);
      setCircles([]);
      setArrows([]);
      setScribbles([]);
      setImages([]);
      setTexts([]);
    }, []);

    const onStageClick = useCallback(
      (e: KonvaEventObject<MouseEvent>) => {
        if (
          ![DrawAction.ZoomIn, DrawAction.ZoomOut].includes(
            drawAction as DrawAction
          )
        )
          return;

        e.evt.preventDefault();
        const stage = stageRef?.current;

        const oldScale = getNumericVal(stage?.scaleX());
        const pointer = stage?.getPointerPosition() || { x: 0, y: 0 };

        const mousePointTo = {
          x: (pointer?.x - getNumericVal(stage?.x())) / oldScale,
          y: (pointer?.y - getNumericVal(stage?.y())) / oldScale,
        };

        const direction = drawAction === DrawAction.ZoomIn ? 1 : -1;

        const newScale =
          direction > 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY;

        stage?.scale({ x: newScale, y: newScale });

        const newPos = {
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale,
        };

        stage?.position(newPos);
      },
      [drawAction, stageRef]
    );

    const onDragShapeEnd = useCallback(
      (e: KonvaEventObject<MouseEvent>) => {
        const type = e.target?.attrs?.name;
        const id = e.target?.attrs?.id;

        const { setter } = getSetterByType(type);
        setter &&
          setter((prevRecords) =>
            prevRecords.map((record) =>
              record.id === id
                ? { ...record, x: e.target.x(), y: e.target.y() }
                : record
            )
          );
      },
      [getSetterByType]
    );

    const onTransformShapeEnd = useCallback(
      (e: KonvaEventObject<MouseEvent>) => {
        const type = e.target?.attrs?.name;
        const id = e.target?.attrs?.id;

        const { setter } = getSetterByType(type);
        setter &&
          setter((prevRecords) =>
            prevRecords.map((record) =>
              record.id === id
                ? {
                    ...record,
                    scaleX: e.target.attrs.scaleX,
                    scaleY: e.target.attrs.scaleY,
                  }
                : record
            )
          );
      },
      [getSetterByType]
    );

    const onImportImageSelect = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
          const imageURL = URL.createObjectURL(e.target.files[0]);
          const image = new Image(300 / 2, 300 / 2);
          image.src = imageURL;
          setImages((prevImages) => [...prevImages, image]);
        }
        e.target.files = null;
      },
      []
    );

    const fileRef = useRef<HTMLInputElement>(null);
    const onImportImageClick = useCallback(() => {
      fileRef?.current && fileRef?.current?.click();
    }, []);
    const onExportClick = useCallback(() => {
      const dataURL = stageRef?.current?.toDataURL({ pixelRatio: 3 });
      downloadURI(dataURL, "image.png");
    }, []);

    const onClearOptionClick = useCallback(
      (action: DrawAction) => {
        switch (action) {
          case DrawAction.Clear: {
            onClear();
            break;
          }
          case DrawAction.Delete: {
            onDeleteShape();
            break;
          }
          case DrawAction.Undo: {
            onUndoClick();
            break;
          }
        }
      },
      [onClear, onDeleteShape, onUndoClick]
    );

    const onAction = useCallback(
      (action: DrawAction) => {
        switch (action) {
          case DrawAction.Rectangle:
          case DrawAction.Circle:
          case DrawAction.Scribble:
          case DrawAction.Arrow:
          case DrawAction.Select: {
            setDrawAction(action);
            break;
          }
          default: {
            onClearOptionClick(action);
          }
        }
      },
      [onClearOptionClick]
    );

    useKeyBindings({ onAction, isWritingInProgress: !!textPosition });
    const backgroundRef = useRef<any>(null);

    useEffect(() => {
      if (inputRef.current) inputRef.current.focus();
    }, [inputRef]);

    // const { downloadDrawingState } = useStoreProgress({
    //   setTexts,
    //   setArrows,
    //   setRectangles,
    //   setCircles,
    //   setScribbles,
    //   scribbles,
    //   arrows,
    //   texts,
    //   rectangles,
    //   circles,
    // });

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    }, [isSaving]);

    // const onDownloadProjectClick = useCallback(() => {
    //   setIsSaving(true);
    //   downloadDrawingState();
    // }, [downloadDrawingState]);

    const getShapeProps = useCallback(
      (shape: NodeConfig) => ({
        key: shape.id,
        id: shape.id,
        onDragStart: onDragShapeStart,
        onDragEnd: onDragShapeEnd,
        onTransformStart: onTransformShapeStart,
        onTransformEnd: onTransformShapeEnd,
        onClick: onShapeClick,
        scaleX: shape.scaleX,
        scaleY: shape.scaleY,
        draggable: isDraggable,
      }),
      [
        onDragShapeStart,
        onDragShapeEnd,
        onTransformShapeStart,
        onTransformShapeEnd,
        onShapeClick,
        isDraggable,
      ]
    );

    useEffect(() => {
      if (containerRef.current) {
        stageRef?.current?.width(containerRef.current.offsetWidth);
        stageRef?.current?.height(containerRef.current.offsetHeight);
      }
    }, [containerRef]);

    const onSecondaryActionChange = useCallback((action: SecondaryAction) => {},
    []);

    const onDuplicate = () => {
      const { setter } = getSetterByType(currentSelectedShape?.type);
      const records = getRecordsByType(currentSelectedShape?.type);
      const record = records?.find(
        (record) => record.id === currentSelectedShape?.id
      );
      if (setter)
        setter((prevRecords) => [
          ...prevRecords,
          { ...record, id: uuidv4(), x: record.x + 5, y: record.y + 5 },
        ]);
      // TODO: update currentSelectedShape to duplicated shape
    };

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
              onAction={(action) => {
                switch (action) {
                  case MiscActions.Delete: {
                    onDeleteShape();
                    break;
                  }
                  case MiscActions.Duplicate: {
                    onDuplicate();
                    break;
                  }
                  case MiscActions.Link: {
                    break;
                  }
                }
              }}
              onShapeAction={() => {}}
            />
          </Box>
        )}
        <Box zIndex={1} left={4} pos="absolute" bottom="20px">
          <SecondaryActionButtons onActionChange={onSecondaryActionChange} />
        </Box>

        <Stage
          ref={stageRef}
          onMouseUp={onStageMouseUp}
          draggable={isStageDraggable}
          onMouseDown={onStageMouseDown}
          onMouseMove={onStageMouseMove}
          onClick={onStageClick}
          x={stageX}
          y={stageY}
          onDragEnd={(e: KonvaEventObject<MouseEvent>) => {
            // setStageXY({ x: e.target.x(), y: e.target.y() });
          }}
          onDragMove={() => {
            backgroundRef?.current?.absolutePosition({ x: 0, y: 0 });
          }}
        >
          <Layer>
            <KonvaRect
              ref={backgroundRef}
              x={0}
              y={0}
              // height={CANVAS_HEIGHT}
              // width={CANVAS_WIDTH}
              fill={"white"}
              id="bg"
              listening={false}
            />
            {images.map((image, index) => (
              <KonvaImage
                key={index}
                image={image}
                x={0}
                y={0}
                // height={CANVAS_WIDTH / 2}
                // width={CANVAS_WIDTH / 2}
                onClick={onShapeClick}
                draggable={isDraggable}
                name="image"
              />
            ))}
            {rectangles?.map((rectangle) => (
              <KonvaRect {...rectangle} {...getShapeProps(rectangle)} />
            ))}
            {currentlyDrawnShape?.name === DrawAction.Rectangle && (
              <KonvaRect
                {...currentlyDrawnShape}
                {...getShapeProps(currentlyDrawnShape)}
              />
            )}
            {circles?.map((circle) => (
              <KonvaCircle {...circle} {...getShapeProps(circle)} />
            ))}
            {currentlyDrawnShape?.name === DrawAction.Circle && (
              <KonvaCircle
                {...currentlyDrawnShape}
                {...getShapeProps(currentlyDrawnShape)}
              />
            )}
            {scribbles.map((scribble) => (
              <KonvaLine
                lineCap="round"
                lineJoin="round"
                {...scribble}
                {...getShapeProps(scribble)}
              />
            ))}
            {currentlyDrawnShape?.name === DrawAction.Scribble && (
              <KonvaLine
                lineCap="round"
                lineJoin="round"
                {...(currentlyDrawnShape as LineConfig)}
                {...getShapeProps(currentlyDrawnShape)}
              />
            )}
            {arrows.map((arrow) => (
              <KonvaArrow {...arrow} {...getShapeProps(arrow)} />
            ))}
            {currentlyDrawnShape?.name === DrawAction.Arrow && (
              <KonvaArrow
                {...(currentlyDrawnShape as ArrowConfig)}
                {...getShapeProps(currentlyDrawnShape)}
              />
            )}
            {texts.map((text) => (
              <KonvaText
                name={DrawAction.Text}
                text={text.text}
                x={text.x}
                y={text.y}
                stroke={text.color}
                letterSpacing={1.7}
                fontSize={14}
                {...getShapeProps(text)}
              />
            ))}
            <Transformer ref={transformerRef} />
          </Layer>
        </Stage>
      </Box>
    );
  }
);

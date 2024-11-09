import {
  Box,
  ButtonGroup,
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Stage,
  Layer,
  Transformer,
  Line,
  Image as KonvaImage,
  Circle,
  Rect,
  Arrow,
} from "react-konva";
import {
  DrawAction,
  DRAW_OPTIONS,
  MISC_OPTIONS,
  MiscAction,
} from "../../constants";
import { getNumericVal, getRelativePointerPosition } from "../../utilities";
import { v4 as uuidv4 } from "uuid";
import { Stage as StageType } from "konva/lib/Stage";
import { Transformer as TransformerType } from "konva/lib/shapes/Transformer";
import { ImageConfig } from "konva/lib/shapes/Image";
import { ArrowConfig } from "konva/lib/shapes/Arrow";
import { SketchPicker } from "react-color";

interface DrawProps {}

const downloadURI = (uri: string | undefined, name: string) => {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri || "";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const Draw: React.FC<DrawProps> = React.memo(function Draw({}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const stageRef = useRef<StageType | null>(null);

  const transformerRef = useRef<TransformerType>(null);

  const [color, setColor] = useState("black");
  const [drawAction, setDrawAction] = useState<DrawAction>(DrawAction.Scribble);

  const [currentlyDrawnShape, setCurrentlyDrawnShape] = useState<NodeConfig>();
  const [drawings, setDrawings] = useState<NodeConfig[]>([]);

  const isPaintRef = useRef(false);

  const onImportImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        const imageUrl = URL.createObjectURL(e.target.files?.[0]);
        const image = new Image(200, 200);
        image.src = imageUrl;
        setDrawings((prevDrawings) => [
          ...prevDrawings,
          {
            id: uuidv4(),
            name: DrawAction.Image,
            image,
            x: 0,
            y: 0,
            height: 200,
            width: 200,
          },
        ]);
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
    const dataUri = stageRef?.current?.toDataURL({ pixelRatio: 3 });
    downloadURI(dataUri, "image.png");
  }, []);

  const onClear = useCallback(() => {
    setDrawings([]);
  }, []);

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

  const deSelect = useCallback(() => {
    transformerRef?.current?.nodes([]);
  }, []);

  const bgRef = useRef(null);

  const checkDeselect = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const clickedOnEmpty = e.target === bgRef?.current;
      if (clickedOnEmpty) {
        deSelect();
      }
    },
    [stageRef, deSelect]
  );

  const onStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    checkDeselect(e);
    const stage = stageRef?.current;
    if (e.evt.button !== 0 || !stage || drawAction === DrawAction.Select)
      return;
    const id = uuidv4();

    const pos = stage?.getPointerPosition();
    const x = pos?.x || 0;
    const y = pos?.y || 0;

    isPaintRef.current = true;

    switch (drawAction) {
      case DrawAction.Scribble: {
        setCurrentlyDrawnShape({
          id,
          points: [x, y, x, y],
          name: DrawAction.Scribble,
          stroke: color,
        });
        break;
      }
      case DrawAction.Circle: {
        setCurrentlyDrawnShape({
          id,
          radius: 1,
          x,
          y,
          name: DrawAction.Circle,
          stroke: color,
        });
        break;
      }
      case DrawAction.Rectangle: {
        setCurrentlyDrawnShape({
          id,
          height: 1,
          width: 1,
          x,
          y,
          name: DrawAction.Rectangle,
          stroke: color,
        });
        break;
      }
      case DrawAction.Arrow: {
        setCurrentlyDrawnShape({
          id,
          points: [x, y, x, y],
          name: DrawAction.Arrow,
          stroke: color,
        });
        break;
      }
    }
  };

  const onStageMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    const stage = stageRef?.current;
    if (e.evt.button !== 0 || !stage || drawAction === DrawAction.Select)
      return;

    const pos = stage?.getPointerPosition();
    const x = pos?.x || 0;
    const y = pos?.y || 0;

    if (!isPaintRef.current) return;

    switch (drawAction) {
      case DrawAction.Scribble: {
        setCurrentlyDrawnShape((prevCurrentlyDrawnShape) => ({
          ...prevCurrentlyDrawnShape,
          points: [...(prevCurrentlyDrawnShape?.points || []), x, y],
        }));
        break;
      }
      case DrawAction.Rectangle: {
        setCurrentlyDrawnShape((prevCurrentlyDrawnShape) => ({
          ...prevCurrentlyDrawnShape,
          height: y - (prevCurrentlyDrawnShape?.y || 0),
          width: x - (prevCurrentlyDrawnShape?.x || 0),
        }));
        break;
      }
      case DrawAction.Arrow: {
        setCurrentlyDrawnShape((prevCurrentlyDrawnShape) => ({
          ...prevCurrentlyDrawnShape,
          points: [
            prevCurrentlyDrawnShape?.points[0],
            prevCurrentlyDrawnShape?.points[1],
            x,
            y,
          ],
        }));
        break;
      }
      case DrawAction.Circle: {
        setCurrentlyDrawnShape((prevCurrentlyDrawnShape) => ({
          ...prevCurrentlyDrawnShape,
          radius:
            ((x - (prevCurrentlyDrawnShape?.x || 0)) ** 2 +
              (y - (prevCurrentlyDrawnShape?.y || 0)) ** 2) **
            0.5,
        }));
        break;
      }
    }
  };

  const currentSelectedShapeRef = useRef<string | null>(null);

  const onShapeClick = (e: KonvaEventObject<MouseEvent>) => {
    if (drawAction !== DrawAction.Select) return;
    const node = e.currentTarget;
    currentSelectedShapeRef.current = node?.attrs?.id;
    transformerRef.current?.nodes([node]);
  };

  const shapeProps = {
    onClick: onShapeClick,
    draggable: drawAction === DrawAction.Select,
  };

  const onDelete = () => {
    setDrawings((prevDrawings) =>
      prevDrawings.filter(
        (drawing) => drawing.id !== currentSelectedShapeRef.current
      )
    );
    transformerRef?.current?.nodes([]);
  };

  const onMiscAction = (action: MiscAction) => {
    switch (action) {
      case MiscAction.Clear: {
        onClear();
        break;
      }
      case MiscAction.Export: {
        onExportClick();
        break;
      }
      case MiscAction.Delete: {
        onDelete();
        break;
      }
    }
  };

  return (
    <Box
      ref={containerRef}
      pos="relative"
      height="100vh"
      width="100vw"
      overflow={"hidden"}
    >
      <Flex gap={4} pos="absolute" top={2} left={2} zIndex={1}>
        <ButtonGroup size="sm" isAttached variant="solid">
          {DRAW_OPTIONS.map(({ id, icon }) => (
            <IconButton
              aria-label="Drawing Options"
              icon={icon}
              onClick={() => {
                if (id === DrawAction.Image) {
                  onImportImageClick();
                  return;
                }
                setDrawAction(id);
              }}
              size="sm"
              colorScheme={id === drawAction ? "whatsapp" : undefined}
            />
          ))}
        </ButtonGroup>

        <ButtonGroup size="sm" isAttached variant="solid">
          {MISC_OPTIONS.map(({ id, icon }) => (
            <IconButton
              aria-label="Misc Options"
              icon={icon}
              onClick={() => onMiscAction(id)}
              size="sm"
            />
          ))}
        </ButtonGroup>

        <Popover>
          <PopoverTrigger>
            <Box
              bg={color}
              h={"30px"}
              w={"30px"}
              borderRadius="8px"
              cursor="pointer"
            ></Box>
          </PopoverTrigger>
          <PopoverContent width="300">
            <PopoverArrow />
            <PopoverCloseButton />
            <SketchPicker
              color={color}
              onChangeComplete={(selectedColor) => setColor(selectedColor.hex)}
            />
          </PopoverContent>
        </Popover>

        <input
          type="file"
          ref={fileRef}
          onChange={onImportImageSelect}
          style={{ display: "none" }}
          accept="image/*"
        />
      </Flex>

      <Stage
        ref={stageRef}
        onMouseUp={onStageMouseUp}
        onMouseDown={onStageMouseDown}
        onMouseMove={onStageMouseMove}
        height={viewHeight}
        width={viewWidth}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={viewWidth}
            height={viewHeight}
            fill="white"
            ref={bgRef}
          />
          {[...drawings, currentlyDrawnShape].map((drawing) => {
            if (drawing?.name === DrawAction.Scribble) {
              return <Line {...drawing} {...shapeProps} />;
            }
            if (drawing?.name === DrawAction.Circle) {
              return <Circle {...drawing} {...shapeProps} />;
            }
            if (drawing?.name === DrawAction.Rectangle) {
              return <Rect {...drawing} {...shapeProps} />;
            }
            if (drawing?.name === DrawAction.Arrow) {
              return <Arrow {...(drawing as ArrowConfig)} {...shapeProps} />;
            }
            if (drawing?.name === DrawAction.Image) {
              return (
                <KonvaImage {...(drawing as ImageConfig)} {...shapeProps} />
              );
            }
            return null;
          })}

          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </Box>
  );
});

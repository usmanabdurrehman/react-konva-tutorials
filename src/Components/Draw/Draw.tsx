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
import React, { useRef, useState } from "react";
import {
  DrawAction,
  DRAW_OPTIONS,
  MISC_OPTIONS,
  MiscAction,
} from "../../constants";
import { SketchPicker } from "react-color";
import {
  Arrow,
  Circle,
  Image as ReactImage,
  Layer,
  Line,
  Rect,
  Stage,
  Transformer,
} from "react-konva";
import { KonvaEventObject, NodeConfig } from "konva/lib/Node";
import { Stage as StageType } from "konva/lib/Stage";
import { ArrowConfig } from "konva/lib/shapes/Arrow";
import { ImageConfig } from "konva/lib/shapes/Image";
import { Transformer as TransformerType } from "konva/lib/shapes/Transformer";
import { v4 as uuidv4 } from "uuid";

interface DrawProps {}

const downloadImage = (uri: string) => {
  const a = document.createElement("a");
  a.download = "image.png";
  a.href = uri;
  a.click();
};

export const Draw: React.FC<DrawProps> = React.memo(function Draw({}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [color, setColor] = useState("black");
  const [drawAction, setDrawAction] = useState<DrawAction>(DrawAction.Scribble);

  const stageRef = useRef<StageType | null>(null);
  const transformerRef = useRef<TransformerType>(null);
  const isPaintRef = useRef(false);

  const [currentlyDrawnShape, setCurrentlyDrawnShape] = useState<NodeConfig>();
  const [drawings, setDrawings] = useState<NodeConfig[]>([]);

  const onStageMouseUp = () => {
    isPaintRef.current = false;

    if (currentlyDrawnShape) {
      setDrawings((prevDrawings) => [...prevDrawings, currentlyDrawnShape]);
      setCurrentlyDrawnShape(undefined);
    }
  };

  const checkDeSelect = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target === stageRef?.current) {
      transformerRef?.current?.nodes([]);
    }
  };

  const onStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    checkDeSelect(e);
    const stage = stageRef?.current;
    if (e.evt.button !== 0 || !stage || drawAction === DrawAction.Select)
      return;
    const pos = stage?.getPointerPosition();
    const x = pos?.x || 0;
    const y = pos?.y || 0;
    const id = uuidv4();

    isPaintRef.current = true;
    switch (drawAction) {
      case DrawAction.Arrow: {
        setCurrentlyDrawnShape({
          name: DrawAction.Arrow,
          points: [x, y, x, y],
          stroke: color,
          id,
        });

        break;
      }
      case DrawAction.Rectangle: {
        setCurrentlyDrawnShape({
          name: DrawAction.Rectangle,
          x,
          y,
          heigth: 1,
          width: 1,
          stroke: color,
          id,
        });

        break;
      }
      case DrawAction.Circle: {
        setCurrentlyDrawnShape({
          name: DrawAction.Circle,
          x,
          y,
          radius: 1,
          stroke: color,
          id,
        });

        break;
      }
      case DrawAction.Scribble: {
        setCurrentlyDrawnShape({
          name: DrawAction.Scribble,
          points: [x, y, x, y],
          stroke: color,
          id,
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
      case DrawAction.Arrow: {
        setCurrentlyDrawnShape((prevCurrentlyDrawnShape) => ({
          ...prevCurrentlyDrawnShape,
          points: [
            prevCurrentlyDrawnShape?.points?.[0],
            prevCurrentlyDrawnShape?.points?.[1],
            x,
            y,
          ],
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
      case DrawAction.Rectangle: {
        setCurrentlyDrawnShape((prevCurrentlyDrawnShape) => ({
          ...prevCurrentlyDrawnShape,
          height: y - (prevCurrentlyDrawnShape?.y || 0),
          width: x - (prevCurrentlyDrawnShape?.x || 0),
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

  const fileRef = useRef<HTMLInputElement | null>(null);
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const image = new Image(200, 200);
      image.src = url;

      setDrawings((prevDrawings) => [
        ...prevDrawings,
        {
          name: DrawAction.Image,
          x: 0,
          y: 0,
          image,
          height: 200,
          width: 200,
          id: uuidv4(),
        },
      ]);
    }
  };

  const onClear = () => {
    setDrawings([]);
  };

  const currentSelectedShapeRef = useRef<string>();

  const onDelete = () => {
    setDrawings((prevDrawings) =>
      prevDrawings.filter(
        (drawing) => drawing.id !== currentSelectedShapeRef.current
      )
    );
    transformerRef?.current?.nodes([]);
  };

  const onExport = () => {
    const dataURI = stageRef?.current?.toDataURL({ pixelRatio: 3 });
    downloadImage(dataURI || "");
  };

  const onMiscChange = (id: MiscAction) => {
    switch (id) {
      case MiscAction.Clear: {
        onClear();
        break;
      }
      case MiscAction.Delete: {
        onDelete();
        break;
      }
      case MiscAction.Export: {
        onExport();
        break;
      }
    }
  };

  const onShapeClick = (e: KonvaEventObject<MouseEvent>) => {
    if (drawAction !== DrawAction.Select) return;
    const node = e.currentTarget;
    currentSelectedShapeRef.current = node?.attrs?.id;
    transformerRef?.current?.nodes([node]);
  };

  const shapeProps = {
    onClick: onShapeClick,
    draggable: drawAction === DrawAction.Select,
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
                  fileRef?.current?.click();
                } else {
                  setDrawAction(id);
                }
              }}
              size="sm"
              colorScheme={id === drawAction ? "whatsapp" : undefined}
            />
          ))}
        </ButtonGroup>

        <input
          type="file"
          ref={fileRef}
          accept="image/*"
          style={{ display: "none" }}
          onChange={onInputChange}
        />

        <ButtonGroup size="sm" isAttached variant="solid">
          {MISC_OPTIONS.map(({ id, icon }) => (
            <IconButton
              aria-label="Misc Options"
              icon={icon}
              onClick={() => onMiscChange(id)}
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
      </Flex>
      <Stage
        ref={stageRef}
        onMouseDown={onStageMouseDown}
        onMouseMove={onStageMouseMove}
        onMouseUp={onStageMouseUp}
        height={window.innerHeight}
        width={window.innerWidth}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            fill="white"
            height={window.innerHeight}
            width={window.innerWidth}
          />
          {[...drawings, currentlyDrawnShape].map((shape) => {
            if (shape?.name === DrawAction.Arrow)
              return <Arrow {...(shape as ArrowConfig)} {...shapeProps} />;
            if (shape?.name === DrawAction.Rectangle)
              return <Rect {...shape} {...shapeProps} />;
            if (shape?.name === DrawAction.Circle)
              return <Circle {...shape} {...shapeProps} />;
            if (shape?.name === DrawAction.Scribble)
              return <Line {...shape} {...shapeProps} />;
            if (shape?.name === DrawAction.Image)
              return <ReactImage {...(shape as ImageConfig)} {...shapeProps} />;
            return null;
          })}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </Box>
  );
});

import {
  Arrow,
  BoldStrokeWidth,
  Circle,
  DashedStroke,
  DottedStroke,
  Duplicate,
  Eraser,
  Hand,
  Line,
  Link,
  MediumStrokeWidth,
  Pencil,
  Rectangle,
  Select,
  SolidStroke,
  Text,
  ThinStrokeWidth,
  Trash,
  RoundEdges,
  SharpEdges,
  Diamond,
} from "../icons";

export enum DrawAction {
  ZoomOut = "zoomOut",
  ZoomIn = "zoomIn",
  Move = "move",
  Select = "select",
  Text = "text",
  Rectangle = "rectangle",
  Diamond = "diamond",
  Circle = "circle",
  Scribble = "freedraw",
  Arrow = "arrow",
  Line = "line",
  Delete = "delete",
  Clear = "clear",
  Undo = "undo",
  Eraser = "eraser",
}

export const PAINT_DRAW_OPTIONS = [
  {
    id: DrawAction.Move,
    label: "Hand(Panning tool)--H",
    icon: <Hand />,
  },
  {
    id: DrawAction.Select,
    label: "Selection--V or 1",
    icon: <Select />,
    keyBind: "1",
  },
  {
    id: DrawAction.Rectangle,
    label: "Rectangle--R or 2",
    icon: <Rectangle />,
    keyBind: "2",
  },
  {
    id: DrawAction.Diamond,
    label: "Diamond--D or 3",
    icon: <Diamond />,
    keyBind: "3",
  },
  {
    id: DrawAction.Circle,
    label: "Circle--C or 4",
    icon: <Circle />,
    keyBind: "4",
  },
  {
    id: DrawAction.Arrow,
    label: "Arrow--A or 5",
    icon: <Arrow />,
    keyBind: "5",
  },
  { id: DrawAction.Line, label: "Line--L or 6", icon: <Line />, keyBind: "6" },
  {
    id: DrawAction.Scribble,
    label: "Draw--P or 8",
    icon: <Pencil />,
    keyBind: "8",
  },
  { id: DrawAction.Text, label: "Text--T or 9", icon: <Text />, keyBind: "9" },
  {
    id: DrawAction.Eraser,
    label: "Eraser--E or 0",
    icon: <Eraser />,
    keyBind: "0",
  },
];

enum ShapeFill {
  Hachure = "Hachure",
  CrossHatch = "CrossHatch",
  Solid = "Solid",
}

export const SHAPE_FILL_OPTIONS = [
  {
    id: ShapeFill.Hachure,
    label: "Hachure",
    icon: <Hand />,
  },
  {
    id: ShapeFill.CrossHatch,
    label: "Cross-Hatch",
    icon: <Hand />,
  },
  {
    id: ShapeFill.Solid,
    label: "Solid",
    icon: <Hand />,
  },
];

enum StrokeWidth {
  Thin = "Thin",
  Bold = "Bold",
  ExtraBold = "ExtraBold",
}

export const STROKE_WIDTH_OPTIONS = [
  {
    id: StrokeWidth.Thin,
    label: "Thin",
    icon: <ThinStrokeWidth />,
  },
  {
    id: StrokeWidth.Bold,
    label: "Bold",
    icon: <MediumStrokeWidth />,
  },
  {
    id: StrokeWidth.ExtraBold,
    label: "Extra Bold",
    icon: <BoldStrokeWidth />,
  },
];

enum StrokeStyle {
  Solid = "Solid",
  Dashed = "Dashed",
  Dotted = "Dotted",
}

export const STROKE_STYLE_OPTIONS = [
  {
    id: StrokeStyle.Solid,
    label: "Solid",
    icon: <SolidStroke />,
  },
  {
    id: StrokeStyle.Dashed,
    label: "Dashed",
    icon: <DashedStroke />,
  },
  {
    id: StrokeStyle.Dotted,
    label: "Dotted",
    icon: <DottedStroke />,
  },
];

enum ShapeEdges {
  Sharp = "Sharp",
  Round = "Round",
}

export const SHAPE_EDGES_OPTIONS = [
  {
    id: ShapeEdges.Sharp,
    label: "Sharp",
    icon: <SharpEdges />,
  },
  {
    id: ShapeEdges.Round,
    label: "Round",
    icon: <RoundEdges />,
  },
];

export enum MiscActions {
  Duplicate = "Duplicate",
  Delete = "Delete",
  Link = "Link",
}

export const MISC_ACTIONS_OPTIONS = [
  {
    id: MiscActions.Duplicate,
    label: "Duplicate",
    icon: <Duplicate />,
  },
  {
    id: MiscActions.Delete,
    label: "Delete",
    icon: <Trash />,
  },
  {
    id: MiscActions.Link,
    label: "Link",
    icon: <Link />,
  },
];

export const BASE_FONT_SIZE = 16;
export const SCALE_BY = 1.1;

export enum CanvasAction {
  Add = "add",
  Delete = "delete",
  Resize = "resize",
  Drag = "drag",
}

export const ICON_FILL_COLOR = "#030064";

export enum SecondaryAction {
  Undo = "undo",
  Redo = "redo",
  ZoomIn = "zoomIn",
  ZoomOut = "zoomOut",
  ResetZoom = "resetZoom",
}

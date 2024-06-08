import {
  Arrow,
  Circle,
  Eraser,
  Hand,
  Line,
  Pencil,
  Rectangle,
  Select,
  Text,
  Diamond,
  SendToBack,
  SendBackward,
  SendForward,
  SendToFront,
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

export enum LayerOptions {
  SendBackward = "sendBackward",
  SendToBack = "sendToBack",
  SendForward = "sendForward",
  SendToFront = "sendToFront",
}

export const LAYER_OPTIONS = [
  {
    id: LayerOptions.SendToBack,
    label: "Send to back",
    icon: <SendToBack />,
  },
  {
    id: LayerOptions.SendBackward,
    label: "Send backward",
    icon: <SendBackward />,
  },
  {
    id: LayerOptions.SendForward,
    label: "Send forward",
    icon: <SendForward />,
  },
  {
    id: LayerOptions.SendToFront,
    label: "Send to front",
    icon: <SendToFront />,
  },
];

export const ICON_FILL_COLOR = "#030064";

export enum SecondaryAction {
  Undo = "undo",
  Redo = "redo",
  ZoomIn = "zoomIn",
  ZoomOut = "zoomOut",
  ResetZoom = "resetZoom",
}

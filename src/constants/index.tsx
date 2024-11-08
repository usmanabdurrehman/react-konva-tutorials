import {
  ArrowUpLeft,
  ArrowUpRight,
  ArrowUpRightSquareFill,
  Circle,
  Download,
  Image,
  Square,
  Trash,
  XLg,
} from "react-bootstrap-icons";

export enum DrawAction {
  Select = "select",
  Scribble = "scribble",
  Circle = "circle",
  Rectangle = "rectangle",
  Arrow = "arrow",
  Image = "image",
}

export enum MiscAction {
  Clear = "clear",
  Delete = "delete",
  Export = "export",
}

export const DRAW_OPTIONS = [
  {
    id: DrawAction.Select,
    icon: <ArrowUpRightSquareFill />,
  },
  {
    id: DrawAction.Circle,
    icon: <Circle />,
  },
  {
    id: DrawAction.Rectangle,
    icon: <Square />,
  },
  {
    id: DrawAction.Scribble,
    icon: (
      <img
        src={"https://www.svgrepo.com/show/438239/image-scribble-icon.svg"}
        width="24px"
        height="24px"
      />
    ),
  },
  {
    id: DrawAction.Arrow,
    icon: <ArrowUpLeft />,
  },
  {
    id: DrawAction.Image,
    icon: <Image />,
  },
];

export const MISC_OPTIONS = [
  {
    id: MiscAction.Clear,
    icon: <XLg />,
  },
  {
    id: MiscAction.Delete,
    icon: <Trash />,
  },
  {
    id: MiscAction.Export,
    icon: <Download />,
  },
];

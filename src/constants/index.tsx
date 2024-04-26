import { ArrowUpRight, PenFill } from "react-bootstrap-icons";

export enum DrawAction {
  Crown = "crown",
  MultiPointLine = "multipointline",
  Select = "select",
  Scribble = "scribble",
}

export const DRAW_OPTIONS = [
  {
    id: DrawAction.Crown,
    icon: (
      <img
        src={
          "https://static.vecteezy.com/system/resources/previews/020/937/209/non_2x/crown-icon-for-your-website-design-logo-app-ui-free-vector.jpg"
        }
        width="24px"
        height="24px"
      />
    ),
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
    id: DrawAction.MultiPointLine,
    icon: <PenFill />,
  },
  {
    id: DrawAction.Select,
    icon: <ArrowUpRight />,
  },
];

export const MULTI_POINT_LINE_BG = "#a5d8ff";
export const SCRIBBLE_BG = "#ffc9c9";
export const STROKE_COLOR = "#000";
export const CROWN_STROKE = "#dee600";
export const CROWN_BG = "#f2fa0c";
export const MULTI_POINT_LINE_CIRCLE_HOVER_BG = "#afabee";
export const MULTI_POINT_LINE_CIRCLE_STROKE = "#8986E3";

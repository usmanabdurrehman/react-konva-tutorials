export type Shape = {
  id: string;
  color: string;
  x?: number;
  y?: number;
  scaleX: number;
  scaleY: number;
};

export type Rectangle = Shape & {
  width: number;
  height: number;
  x: number;
  y: number;
  isDiamond: boolean;
};

export type Circle = Shape & {
  radius: number;
  x: number;
  y: number;
};

export type Scribble = Shape & {
  points: number[];
};

export type Arrow = Shape & {
  points: [number, number, number, number];
};

export type Text = Shape & {
  text: string;
};

export type IconProps = {
  isSelected?: boolean;
};

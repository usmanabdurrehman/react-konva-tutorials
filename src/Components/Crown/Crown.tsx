import { Context } from "konva/lib/Context";
import { NodeConfig } from "konva/lib/Node";
import { Shape as ShapeType } from "konva/lib/Shape";
import { Shape } from "react-konva";
import { CROWN_BG, CROWN_STROKE } from "../../constants";

const sceneFn = (context: Context, shape: ShapeType) => {
  const width = shape.width();
  const height = shape.height();
  context.beginPath();

  context.moveTo(0, 0);
  context.quadraticCurveTo(width / 4, height / 2, width / 2, 0);
  context.quadraticCurveTo(width * 0.75, height / 2, width, 0);
  context.lineTo(width, height);
  context.lineTo(0, height);

  context.closePath();

  context.fillStrokeShape(shape);
};

export default function Crown({ ...props }: NodeConfig) {
  return (
    <Shape
      {...props}
      stroke={CROWN_STROKE}
      fill={CROWN_BG}
      sceneFunc={sceneFn}
    />
  );
}

import { Context } from "konva/lib/Context";
import { NodeConfig } from "konva/lib/Node";
import { Shape as ShapeType } from "konva/lib/Shape";
import React from "react";
import { Shape } from "react-konva";

const sceneFn = (context: Context, shape: ShapeType) => {
  const height = shape.height();
  const width = shape.width();

  context.beginPath();
  context.moveTo(0, 0);
  context.quadraticCurveTo(width / 4, height / 2, width / 2, 0);
  context.quadraticCurveTo(width * 0.75, height / 2, width, 0);
  context.lineTo(width, height);
  context.lineTo(0, height);

  context.closePath();
  context.fillStrokeShape(shape);
};

export default function Crown(props: NodeConfig) {
  return (
    <Shape {...props} stroke="#dee600" fill="#f2fa0c" sceneFunc={sceneFn} />
  );
}

import { Stage } from "konva/lib/Stage";

export const getNumericVal = (val: number | undefined) => val || 0;

export const getRelativePointerPosition = (node: Stage) => {
  const transform = node.getAbsoluteTransform().copy();
  transform.invert();

  const pos = node.getStage().getPointerPosition();
  if (!pos) return;
  return transform.point(pos);
};

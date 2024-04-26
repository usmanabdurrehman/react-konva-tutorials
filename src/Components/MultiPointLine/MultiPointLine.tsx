import { Circle as CircleType } from "konva/lib/shapes/Circle";
import { LineConfig } from "konva/lib/shapes/Line";
import { useEffect, useMemo, useRef } from "react";
import { Circle, Line } from "react-konva";
import {
  MULTI_POINT_LINE_CIRCLE_HOVER_BG,
  MULTI_POINT_LINE_CIRCLE_STROKE,
} from "../../constants";

interface MultiPointLineProps extends LineConfig {
  onPointDrag: (updateFn: (prevPoints: number[]) => number[]) => void;
  activatePoints: boolean;
  isSelected: boolean;
}

export default function MultiPointLine({
  points,
  onPointDrag,
  activatePoints,
  isSelected,
  ...rest
}: MultiPointLineProps) {
  const { x = 0, y = 0 } = rest;

  const mappedPoints = useMemo(() => {
    if (!activatePoints || !points) return [];
    const mappedPoints: { x?: number; y?: number }[] = [];

    for (let i = 0; i < points.length; i = i + 2) {
      mappedPoints.push({
        x: points?.[i] + x,
        y: points?.[i + 1] + y,
      });
    }
    return mappedPoints;
  }, [points, activatePoints, x, y]);

  const hoverRef = useRef<CircleType | null>(null);

  useEffect(() => {
    document.body.style.cursor = "default";
  }, [activatePoints]);

  return (
    <>
      <Line strokeWidth={2} points={points} tension={0.5} {...rest} />
      {isSelected && (
        <Circle
          radius={9}
          fill={MULTI_POINT_LINE_CIRCLE_HOVER_BG}
          ref={hoverRef}
          visible={false}
        />
      )}
      {mappedPoints.map((point, index) => (
        <Circle
          radius={5}
          strokeWidth={1}
          fill="white"
          stroke={MULTI_POINT_LINE_CIRCLE_STROKE}
          x={point.x}
          y={point.y}
          draggable
          onMouseOver={(e) => {
            e.target.setAttr("fill", "#eee");
            document.body.style.cursor = "pointer";
            hoverRef?.current?.setAttrs({
              x: e.target.x(),
              y: e.target.y(),
              visible: true,
            });
          }}
          onMouseOut={(e) => {
            e.target.setAttr("fill", "white");
            document.body.style.cursor = "default";
            hoverRef?.current?.setAttrs({
              visible: false,
            });
          }}
          onDragMove={(e) => {
            const x = e.target.x();
            const y = e.target.y();

            onPointDrag((prevPoints) => {
              const pointsArr = [...prevPoints];

              pointsArr[index * 2] = x;
              pointsArr[index * 2 + 1] = y;
              return pointsArr;
            });
            hoverRef?.current?.setAttrs({
              x: e.target.x(),
              y: e.target.y(),
              visible: true,
            });
          }}
        />
      ))}
    </>
  );
}

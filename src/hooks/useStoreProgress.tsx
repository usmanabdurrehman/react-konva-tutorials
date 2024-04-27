import { useCallback, useEffect, useRef } from "react";
import { Circle, Scribble, Rectangle, Arrow, Text } from "../types";
import { downloadURI } from "../utilities";
export const useStoreProgress = ({
  setTexts,
  setArrows,
  setRectangles,
  setCircles,
  setScribbles,
  scribbles,
  arrows,
  texts,
  rectangles,
  circles,
}: {
  setScribbles: React.Dispatch<React.SetStateAction<Scribble[]>>;
  setCircles: React.Dispatch<React.SetStateAction<Circle[]>>;
  setTexts: React.Dispatch<React.SetStateAction<Text[]>>;
  setArrows: React.Dispatch<React.SetStateAction<Arrow[]>>;
  setRectangles: React.Dispatch<React.SetStateAction<Rectangle[]>>;
  scribbles: Scribble[];
  arrows: Arrow[];
  texts: Text[];
  rectangles: Rectangle[];
  circles: Circle[];
}) => {
  const timeoutRef = useRef<number | null>(null);

  const storeDrawingState = useCallback(() => {
    localStorage.setItem(
      "drawing",
      JSON.stringify({ scribbles, rectangles, arrows, texts, circles })
    );
  }, [scribbles, rectangles, arrows, texts, circles]);

  const downloadDrawingState = useCallback(() => {
    const fileName = "drawing-state.json";
    const json = JSON.stringify(
      { scribbles, rectangles, arrows, texts, circles },
      null,
      2
    );
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    downloadURI(href, fileName);
  }, [scribbles, rectangles, arrows, texts, circles]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      storeDrawingState();
    }, 1200);
  }, [storeDrawingState]);

  useEffect(() => {
    const {
      scribbles = [],
      rectangles = [],
      arrows = [],
      texts = [],
      circles = [],
    } = JSON.parse(localStorage.getItem("drawing") || "{}");
    setRectangles(rectangles);
    setArrows(arrows);
    setTexts(texts);
    setCircles(circles);
    setScribbles(scribbles);
  }, []);

  return { storeDrawingState, downloadDrawingState };
};

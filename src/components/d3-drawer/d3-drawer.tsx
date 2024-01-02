"use client";

import { useEffectOnce, useTransaction } from "@/hooks";
import { DrawnElement } from "@/types";
import * as d3 from "d3";
import {
  PointerEvent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import DrawnElementComponent from "./drawn-element";

export default function D3Drawer() {
  const yDoc = useRef<Y.Doc | null>(null);
  const yArray = useRef<Y.Array<DrawnElement> | null>(null);
  const webrtc = useRef<WebrtcProvider | null>(null);
  const ref = useRef<SVGSVGElement>(null);

  const [drawing, setDrawing] = useState(false);
  const [drawingElement, setDrawingElement] = useState<DrawnElement>();
  const [trackedPoints, setTrackedPoints] =
    useState<Array<{ x: number; y: number }>>();
  const [data, setData] = useState<Array<DrawnElement>>([]);

  useEffectOnce(() => {
    yDoc.current = new Y.Doc();
    webrtc.current = new WebrtcProvider("drawer-room", yDoc.current);
    yArray.current = yDoc.current.getArray<DrawnElement>("drawn element list");
    return () => {
      yDoc.current?.destroy();
      webrtc.current?.destroy();
    };
  });

  const onYArrayChange = useCallback(
    (e: Y.YArrayEvent<DrawnElement>, tx: Y.Transaction) => {
      setData(e.target.toArray());
    },
    [],
  );

  useEffect(() => {
    yArray.current?.observe(onYArrayChange);
    return () => {
      yArray.current?.unobserve(onYArrayChange);
    };
  }, [onYArrayChange]);

  const handleStartDrawing = useCallback((e: PointerEvent<SVGSVGElement>) => {
    setDrawing(true);
    const points = [getRelativePosition(ref, e)];
    setTrackedPoints(points);
    setDrawingElement({
      elementName: "path",
      d: toPathData(points),
      fill: "none",
      stroke: "black",
      strokeWidth: 1,
    });
  }, []);

  const handleDrawElement = useCallback(
    (points: Array<{ x: number; y: number }> | undefined) => {
      setTrackedPoints(points);
      setDrawingElement((x) => {
        if (x?.elementName === "path") {
          return { ...x, d: toPathData(points) };
        }
        return undefined;
      });
    },
    [],
  );

  const handleFinishDrawing = useTransaction(
    yDoc,
    useCallback((elem: DrawnElement | undefined) => {
      setDrawing(false);
      if (!yArray.current || !elem) {
        return;
      }
      yArray.current.push([elem]);
    }, []),
  );

  return (
    <svg
      ref={ref}
      width="100%"
      height="100%"
      onPointerDown={handleStartDrawing}
      onPointerUp={() => {
        if (drawing) {
          handleFinishDrawing(drawingElement);
        }
      }}
      onPointerMove={(e) => {
        if (drawing) {
          handleDrawElement(trackedPoints?.concat(getRelativePosition(ref, e)));
        }
      }}
    >
      {data.length > 0
        ? data.map((x, i) => (
            <DrawnElementComponent key={`${x.elementName}_${i}`} {...x} />
          ))
        : undefined}
      {drawingElement && (
        <DrawnElementComponent
          key={`${drawingElement.elementName}_${data.length}`}
          {...drawingElement}
        />
      )}
    </svg>
  );
}

function getRelativePosition(ref: RefObject<Element | null>, e: PointerEvent) {
  const bounds = ref.current?.getBoundingClientRect();
  return {
    x: e.clientX - (bounds?.left ?? 0),
    y: e.clientY - (bounds?.top ?? 0),
  };
}

function toPathData(points: Array<{ x: number; y: number }> | undefined) {
  const path = d3.path();
  if (!points || points.length < 1) {
    return "";
  }
  path.moveTo(points[0].x, points[0].y);
  for (const p of points) {
    path.lineTo(p.x, p.y);
  }
  return path.toString();
}

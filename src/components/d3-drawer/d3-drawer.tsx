"use client";

import { useEffectOnce, useTransaction } from "@/hooks";
import { DrawnElement, Point, User } from "@/types";
import { FIELD_NAMES, parseAwareness } from "@/utils";
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

type Pointer = {
  clientId: number;
  user?: User;
  position?: Point;
  pressed?: boolean;
};

export default function D3Drawer() {
  const yDoc = useRef<Y.Doc | null>(null);
  const yArray = useRef<Y.Array<DrawnElement> | null>(null);
  const webrtc = useRef<WebrtcProvider | null>(null);
  const ref = useRef<SVGSVGElement>(null);

  const [initialized, setInitialized] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [drawingElement, setDrawingElement] = useState<DrawnElement>();
  const [trackedPoints, setTrackedPoints] = useState<Point[]>();
  const [data, setData] = useState<DrawnElement[]>([]);
  const [pointers, setPointers] = useState<Pointer[]>([]);

  useEffectOnce(() => {
    yDoc.current = new Y.Doc();
    webrtc.current = new WebrtcProvider("drawer-room", yDoc.current);
    yArray.current = yDoc.current.getArray<DrawnElement>("drawn element list");
    setInitialized(true);
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

  const onAwarenessChange = useCallback(() => {
    if (!webrtc.current || !yDoc.current) {
      return;
    }
    const states = webrtc.current.awareness.getStates();
    const newPointers: Pointer[] = [];
    states.forEach((val, key) => {
      if (key === yDoc.current?.clientID) {
        return;
      }
      const awareness = parseAwareness(val);
      newPointers.push({
        clientId: key,
        user: awareness.user,
        position: awareness.position,
        pressed: awareness.position?.pressed,
      });
    });
    setPointers(newPointers);
  }, []);

  useEffect(() => {
    if (initialized && yArray.current && webrtc.current) {
      yArray.current.observe(onYArrayChange);
      webrtc.current.awareness.on("change", onAwarenessChange);
      const currentNum = Array.from(
        webrtc.current.awareness.getStates().keys(),
      ).length;
      webrtc.current.awareness.setLocalStateField(FIELD_NAMES.user, {
        name: Math.random().toString(),
        color: getColor(currentNum),
      });
      return () => {
        yArray.current?.unobserve(onYArrayChange);
        webrtc.current?.awareness.off("change", onAwarenessChange);
      };
    }
  }, [initialized, onAwarenessChange, onYArrayChange]);

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

  const drawElement = useCallback((points: Point[] | undefined) => {
    setTrackedPoints(points);
    setDrawingElement((x) => {
      if (x?.elementName === "path") {
        return { ...x, d: toPathData(points) };
      }
      return undefined;
    });
  }, []);

  const updateAwareness = useCallback(
    (point: Point) => {
      if (!webrtc.current) {
        return;
      }
      webrtc.current.awareness.setLocalStateField(FIELD_NAMES.position, {
        ...point,
        pressed: drawing,
      });
    },
    [drawing],
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent<SVGSVGElement>, points?: Point[]) => {
      const point = getRelativePosition(ref, e);
      if (drawing) {
        drawElement(points?.concat(point));
      }
      updateAwareness(point);
    },
    [drawElement, drawing, updateAwareness],
  );

  const pushElementToYArray = useTransaction(
    yDoc,
    useCallback((elem: DrawnElement | undefined) => {
      setDrawing(false);
      if (!yArray.current || !elem) {
        return;
      }
      yArray.current.push([elem]);
    }, []),
  );

  const handlePointerUp = useCallback(
    (elem?: DrawnElement) => {
      if (drawing && elem) {
        pushElementToYArray(elem);
      }
    },
    [drawing, pushElementToYArray],
  );

  const handlePointerLeave = useCallback(() => {
    if (!webrtc.current) {
      return;
    }
    webrtc.current.awareness.setLocalStateField(
      FIELD_NAMES.position,
      undefined,
    );
  }, []);

  return (
    <svg
      ref={ref}
      width="100%"
      height="100%"
      onPointerDown={handleStartDrawing}
      onPointerUp={() => handlePointerUp(drawingElement)}
      onPointerMove={(e) => handlePointerMove(e, trackedPoints)}
      onPointerLeave={handlePointerLeave}
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
      {pointers.length > 0
        ? pointers.map((x) =>
            x.position ? (
              <circle
                key={x.clientId}
                cx={x.position?.x}
                cy={x.position?.y}
                r={x.pressed ? 10 : 5}
                fill={x.user?.color ?? "red"}
              />
            ) : undefined,
          )
        : undefined}
    </svg>
  );
}

function getColor(i: number) {
  return d3.schemeCategory10[i % d3.schemeCategory10.length];
}

function getRelativePosition(ref: RefObject<Element | null>, e: PointerEvent) {
  const bounds = ref.current?.getBoundingClientRect();
  return {
    x: e.clientX - (bounds?.left ?? 0),
    y: e.clientY - (bounds?.top ?? 0),
  };
}

function toPathData(points: Point[] | undefined) {
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

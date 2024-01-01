"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { DrawnElement } from "@/types";
import DrawnElementComponent from "./drawn-element";

export default function D3Drawer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const svgElements = useRef<d3.Selection<
    SVGSVGElement,
    unknown,
    null,
    undefined
  > | null>(null);

  const [drawing, setDrawing] = useState(false);
  const [data, setData] = useState<Array<DrawnElement>>([]);

  useEffect(() => {
    if (!svgRef.current || svgElements.current) {
      return;
    }
    svgElements.current = d3.select(svgRef.current);
    svgElements.current
      .append("circle")
      .attr("cx", 150)
      .attr("cy", 70)
      .attr("r", 50);
  }, []);

  const onStartDrawing = useCallback(() => {
    console.log("start drawing");
    setDrawing(true);
    setData((x) =>
      x.concat({
        elementName: "path",
        points: [
          { x: 1, y: 1 },
          { x: 50, y: 50 },
        ],
        stroke: 'black'
      })
    );
  }, []);

  const onFinishDrawing = useCallback(() => {
    console.log("finish drawing");
    setDrawing(false);
  }, []);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      onPointerDown={onStartDrawing}
      onPointerUp={onFinishDrawing}
    >
      {data.length > 0
        ? data.map((x, i) => (
            <DrawnElementComponent key={`${x.elementName}${i}`} elem={x} />
          ))
        : undefined}
    </svg>
  );
}

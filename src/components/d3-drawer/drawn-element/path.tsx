'use client'

import { DrawnPath } from "@/types";
import { useEffect, useRef } from "react";
import * as d3 from 'd3'

export default function PathElement(props: { elem: DrawnPath }) {
  const ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    console.log(props.elem)
    if (!ref.current) {
      return;
    }
    const { points, stroke, strokeWidth } = props.elem;
    if (points.length < 1) {
      return;
    }
    const path = d3.path()
    path.moveTo(points[0].x, points[0].y)
    for (const p of points) {
      path.lineTo(p.x, p.y);
    }

    const selection = d3.select(ref.current).attr('d', path.toString());
    if (stroke) {
      selection.attr('stroke', stroke);
    }
    if (strokeWidth) {
      selection.attr('stroke-width', strokeWidth)
    }
  }, [props.elem]);
  return (
    <path
      ref={ref}
    />
  );
}

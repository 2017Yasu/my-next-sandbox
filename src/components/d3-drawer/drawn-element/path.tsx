"use client";

import { DrawnPath } from "@/types";
import { useRef } from "react";

export default function PathElement(props: DrawnPath) {
  const ref = useRef<SVGPathElement>(null);
  return <path ref={ref} {...props} />;
}

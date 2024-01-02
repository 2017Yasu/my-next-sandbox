"use client";

import { DrawnPath } from "@/types";
import { useMemo, useRef } from "react";

export default function PathElement(props: DrawnPath) {
  const ref = useRef<SVGPathElement>(null);
  const pathProps = useMemo(() => {
    const tmp = { ...props, elementName: undefined };
    delete tmp.elementName;
    return tmp
  }, [props]);
  return <path ref={ref} {...pathProps} />;
}

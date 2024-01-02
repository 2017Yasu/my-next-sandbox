"use client";

import { DrawnElement } from "@/types";
import { useMemo } from "react";
import EllipseElement from "./ellipse";
import PathElement from "./path";

export default function DrawnElement(props: DrawnElement) {
  const component = useMemo(() => {
    switch (props.elementName) {
      case "path":
        return <PathElement {...props} />;
      case "ellipse":
        return <EllipseElement {...props} />;
      default:
        return null;
    }
  }, [props]);

  return component;
}

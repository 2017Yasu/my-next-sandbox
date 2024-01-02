import { DrawnEllipse } from "@/types";
import { useMemo } from "react";

export default function EllipseElement(props: DrawnEllipse) {
  const ellipseProps = useMemo(() => {
    const tmp = { ...props, elementName: undefined };
    delete tmp.elementName;
    return tmp;
  }, [props]);
  return <ellipse {...ellipseProps} />;
}

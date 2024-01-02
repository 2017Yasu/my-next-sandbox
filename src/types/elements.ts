import { SVGProps } from "react";

export interface DrawnElementBase<ElemName extends string> {
  elementName: ElemName;
}

export interface DrawnPath
  extends DrawnElementBase<"path">,
    SVGProps<SVGPathElement> {}

export interface DrawnEllipse
  extends DrawnElementBase<"ellipse">,
    SVGProps<SVGEllipseElement> {}

export type DrawnElement = DrawnPath | DrawnEllipse;
export type DrawnElementType = DrawnElement["elementName"];

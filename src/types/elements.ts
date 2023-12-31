export interface DrawnElementBase<ElemName extends string> {
    elementName: ElemName;
    stroke?: string | undefined;
    strokeWidth?: number | undefined;
    fill?: string | undefined;
}

export interface DrawnPath extends DrawnElementBase<"path"> {
  points: Array<{ x: number; y: number }>;
}

export interface DrawnEllipse extends DrawnElementBase<"ellipse"> {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export type DrawnElement = DrawnPath | DrawnEllipse;
export type DrawnElementType = DrawnElement["elementName"];

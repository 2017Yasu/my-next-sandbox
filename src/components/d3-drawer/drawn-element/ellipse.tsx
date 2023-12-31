import { DrawnEllipse } from "@/types";

export default function EllipseElement(props: { elem: DrawnEllipse }) {
  return <ellipse cx="100" cy="50" rx="100" ry="50" />;
}

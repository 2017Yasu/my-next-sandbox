'use client'

import { DrawnElement } from "@/types";
import { useMemo } from "react";
import EllipseElement from "./ellipse";
import PathElement from "./path";

export default function DrawnElement(props: { elem: DrawnElement }) {
    const component = useMemo(() => {
        switch (props.elem.elementName) {
            case 'path':
                return <PathElement elem={props.elem} />
            case 'ellipse':
                return <EllipseElement elem={props.elem} />
            default:
                return null;
        }
    }, [props.elem]);

    return component;
}

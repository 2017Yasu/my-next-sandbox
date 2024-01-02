"use client";

import { RefObject } from "react";
import * as Y from "yjs";

type VoidCallback = (...args: any[]) => void | Promise<void>;

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any
  ? A
  : never;

export function useTransaction<T extends VoidCallback>(
  yDoc: RefObject<Y.Doc | null>,
  callback: T,
) {
  return (...args: ArgumentTypes<T>) => {
    if (!yDoc.current) {
      return;
    }
    yDoc.current.transact(() => {
      callback(...args);
    });
  };
}

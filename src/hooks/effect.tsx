"use client";

import { EffectCallback, useEffect, useRef } from "react";

export function useEffectOnce(effect: EffectCallback) {
  const calledAt = useRef(0);
  const destructor = useRef<ReturnType<EffectCallback> | null>(null);
  useEffect(() => {
    if (calledAt.current) {
      if (destructor.current) {
        return destructor.current;
      }
      return;
    }
    calledAt.current = new Date().getTime();
    const fn = effect();
    if (fn) {
      destructor.current = () => {
        const elapsed = new Date().getTime() - calledAt.current;
        if (elapsed > 100) {
          fn();
        }
      };
      return destructor.current;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

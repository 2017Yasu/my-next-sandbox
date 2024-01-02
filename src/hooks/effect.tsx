"use client";

import { EffectCallback, useEffect, useRef } from "react";

export function useEffectOnce(effect: EffectCallback) {
  const called = useRef(false);
  useEffect(() => {
    if (called.current) {
      return;
    }
    called.current = true;
    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

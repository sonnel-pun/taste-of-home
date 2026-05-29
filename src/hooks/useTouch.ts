"use client";

import { useCallback, useRef, useEffect } from "react";

/**
 * A hook that provides reliable click/touch handling across all browsers.
 * Uses pointer events with native addEventListener fallback for React 19 + Turbopack compatibility.
 */
export function useTouch(
  handler: () => void,
  deps: React.DependencyList = []
) {
  const ref = useRef<HTMLButtonElement | HTMLDivElement | null>(null);
  const handlerRef = useRef(handler);

  // Keep handler ref current
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  // Use native event listener as fallback for mobile
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onPointerDown = () => {
      handlerRef.current();
    };

    // Use pointerdown for immediate response, with click fallback
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("click", onPointerDown);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("click", onPointerDown);
    };
  }, deps);

  // Also return an onClick for keyboard/accessibility
  const onClick = useCallback(() => {
    handler();
  }, deps);

  return { ref, onClick };
}

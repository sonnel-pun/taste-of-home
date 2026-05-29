"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TouchButtonProps {
  children: ReactNode;
  onPress: () => void;
  className?: string;
  variant?: "chip" | "card" | "result";
  active?: boolean;
}

/**
 * A reliable touch button that works on ALL mobile browsers.
 * Uses native event listeners to bypass React 19 + Turbopack click issues.
 */
export function TouchButton({
  children,
  onPress,
  className,
  variant = "chip",
  active,
}: TouchButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pressRef = useRef(onPress);

  // Keep callback current
  useEffect(() => {
    pressRef.current = onPress;
  }, [onPress]);

  // Native event listeners for reliable mobile touch
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Use pointerdown for immediate response on both mouse and touch
    const handlePointerDown = (e: PointerEvent) => {
      e.preventDefault();
      pressRef.current();
    };

    // Also handle touchend for iOS Safari compatibility
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      pressRef.current();
    };

    el.addEventListener("pointerdown", handlePointerDown, { passive: false });
    el.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      el.removeEventListener("pointerdown", handlePointerDown);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const variantStyles = {
    chip: cn(
      "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm",
      "select-none touch-manipulation",
      active
        ? "border-accent bg-accent-soft text-accent font-medium"
        : "border-border bg-card text-foreground"
    ),
    card: cn(
      "flex flex-col items-start gap-1 rounded-2xl border border-border bg-card p-4",
      "select-none touch-manipulation text-left"
    ),
    result: cn(
      "w-full rounded-2xl border border-border bg-card p-4",
      "select-none touch-manipulation text-left"
    ),
  };

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      className={cn(variantStyles[variant], className)}
      style={{
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    >
      {children}
    </div>
  );
}

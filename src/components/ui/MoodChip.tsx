"use client";

import { cn } from "@/lib/utils";

interface MoodChipProps {
  mood: string;
  emoji: string;
  active?: boolean;
  onClick?: () => void;
}

export function MoodChip({ mood, emoji, active, onClick }: MoodChipProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('[MoodChip] clicked:', mood);
        onClick?.();
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-all",
        "hover:border-accent hover:bg-accent-soft touch-manipulation select-none",
        active
          ? "border-accent bg-accent-soft text-accent font-medium"
          : "border-border bg-card text-foreground"
      )}
    >
      <span>{emoji}</span>
      <span>{mood}</span>
    </button>
  );
}

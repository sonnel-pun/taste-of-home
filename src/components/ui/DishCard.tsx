"use client";

import { cn } from "@/lib/utils";

interface DishCardProps {
  emoji: string;
  nameEn: string;
  nameNative?: string;
  onClick?: () => void;
}

export function DishCard({ emoji, nameEn, nameNative, onClick }: DishCardProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('[DishCard] clicked:', nameEn);
        onClick?.();
      }}
      className={cn(
        "flex flex-col items-start gap-1 rounded-2xl border border-border bg-card p-4",
        "transition-all hover:-translate-y-0.5 hover:border-accent touch-manipulation select-none",
        "text-left active:scale-95"
      )}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="font-semibold text-sm leading-tight">{nameEn}</span>
      {nameNative && (
        <span className="text-xs text-muted">{nameNative}</span>
      )}
    </button>
  );
}

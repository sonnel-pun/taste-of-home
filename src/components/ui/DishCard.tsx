"use client";

import { TouchButton } from "./TouchButton";

interface DishCardProps {
  emoji: string;
  nameEn: string;
  nameNative?: string;
  onClick?: () => void;
}

export function DishCard({ emoji, nameEn, nameNative, onClick }: DishCardProps) {
  return (
    <TouchButton variant="card" onPress={onClick || (() => {})}>
      <span className="text-3xl">{emoji}</span>
      <span className="font-semibold text-sm leading-tight">{nameEn}</span>
      {nameNative && (
        <span className="text-xs text-muted">{nameNative}</span>
      )}
    </TouchButton>
  );
}

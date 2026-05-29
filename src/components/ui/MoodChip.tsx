"use client";

import { TouchButton } from "./TouchButton";

interface MoodChipProps {
  mood: string;
  emoji: string;
  active?: boolean;
  onClick?: () => void;
}

export function MoodChip({ mood, emoji, active, onClick }: MoodChipProps) {
  return (
    <TouchButton variant="chip" active={active} onPress={onClick || (() => {})}>
      <span>{emoji}</span>
      <span>{mood}</span>
    </TouchButton>
  );
}

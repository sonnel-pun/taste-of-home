"use client";

import { cn } from "@/lib/utils";

interface SearchResultCardProps {
  dish: {
    nameEn: string;
    emoji?: string;
    nameNative?: string;
  };
  place: {
    name: string;
    type: "restaurant" | "grocery";
    address: string;
    city?: string;
  };
  authenticityScore?: number;
  priceRange?: string;
  verifiedByCount?: number;
  onClick?: () => void;
}

function AuthenticityBar({ score }: { score?: number }) {
  if (score == null) return null;
  const color = score >= 80 ? "bg-green" : score >= 60 ? "bg-yellow" : "bg-muted";
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted">Authenticity:</span>
      <div className="h-1 w-16 rounded-full bg-border overflow-hidden">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${score}%` }} />
      </div>
      <span className={cn("text-xs font-semibold", score >= 80 ? "text-green" : score >= 60 ? "text-yellow" : "text-muted")}>
        {score}%
      </span>
    </div>
  );
}

export function SearchResultCard({
  dish,
  place,
  authenticityScore,
  priceRange,
  verifiedByCount,
  onClick,
}: SearchResultCardProps) {
  const isGrocery = place.type === "grocery";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl border border-border bg-card p-4 text-left",
        "transition-colors hover:border-accent cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {dish.emoji && <span className="text-2xl shrink-0">{dish.emoji}</span>}
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate">{dish.nameEn}</div>
            {dish.nameNative && <div className="text-xs text-muted truncate">{dish.nameNative}</div>}
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
            isGrocery
              ? "bg-green/10 text-green"
              : "bg-accent-soft text-accent"
          )}
        >
          {isGrocery ? "Grocery" : "Restaurant"}
        </span>
      </div>

      <div className="text-sm text-muted mb-2">
        📍 {place.name} · {place.address}
      </div>

      {!isGrocery ? (
        <div className="flex items-center justify-between">
          <AuthenticityBar score={authenticityScore} />
          {verifiedByCount != null && (
            <span className="text-xs text-muted">
              👤 {verifiedByCount} verified
            </span>
          )}
        </div>
      ) : (
        <div className="text-xs text-muted">
          Buy ingredients here
        </div>
      )}
    </button>
  );
}

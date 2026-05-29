"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchResultCard } from "@/components/ui/SearchResultCard";
import { useSearch } from "@/hooks/useSearch";

const MOODS = [
  { mood: "homesick", emoji: "🏠" },
  { mood: "celebrating", emoji: "🎉" },
  { mood: "comfort", emoji: "🤒" },
  { mood: "nostalgic", emoji: "🕰️" },
  { mood: "excited", emoji: "🆕" },
];

const POPULAR_DISHES = [
  { emoji: "🍖", nameEn: "Char Siu", nameNative: "叉燒" },
  { emoji: "🍜", nameEn: "Wonton Noodles", nameNative: "鮮蝦雲吞麵" },
  { emoji: "🧋", nameEn: "HK Milk Tea", nameNative: "港式奶茶" },
  { emoji: "🍞", nameEn: "HK French Toast", nameNative: "西多士" },
  { emoji: "🥧", nameEn: "Egg Tart", nameNative: "蛋撻" },
  { emoji: "🍡", nameEn: "Curry Fishballs", nameNative: "咖哩魚蛋" },
  { emoji: "🥯", nameEn: "Pineapple Bun", nameNative: "菠蘿包" },
  { emoji: "🥓", nameEn: "Siu Yuk", nameNative: "燒肉" },
];

// Force browser navigation (bypass Next.js router)
function goTo(url: string) {
  window.location.href = url;
}

function HomeContent() {
  const searchParams = useSearchParams();
  const { results, loading, error, hasSearched, search } = useSearch();
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const q = searchParams.get("q");
    const mood = searchParams.get("mood");
    if (q || mood) {
      search({ q: q || undefined, mood: mood || undefined });
      if (q) setSearchInput(q);
    }
  }, [searchParams, search]);

  const activeMood = searchParams.get("mood") || "";

  return (
    <div className="mx-auto max-w-md px-5 py-6 min-h-screen">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">
            Taste<span className="text-accent">of</span>Home
          </h1>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-sm select-none">👋</div>
        </div>
      </header>

      {/* Search */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          if (searchInput.trim()) {
            goTo(`/?q=${encodeURIComponent(searchInput.trim())}`);
          }
        }}
        className="mb-5"
      >
        <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-card px-4 py-3.5">
          <span className="text-muted select-none">🔍</span>
          <input
            type="text"
            placeholder="Craving something specific?"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted"
          />
        </div>
      </form>

      {/* Moods */}
      <div className="mb-6">
        <div className="mb-2.5 text-xs font-medium uppercase tracking-wider text-muted select-none">
          How are you feeling?
        </div>
        <div className="flex flex-wrap gap-2">
          {MOODS.map(({ mood, emoji }) => {
            const isActive = activeMood === mood;
            return (
              <div
                key={mood}
                onClick={() => {
                  console.log('[Mood] navigating to:', mood);
                  goTo(isActive ? "/" : `/?mood=${mood}`);
                }}
                className={
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-all cursor-pointer select-none " +
                  (isActive
                    ? "border-accent bg-accent-soft text-accent font-medium"
                    : "border-border bg-card text-foreground hover:border-accent hover:bg-accent-soft")
                }
                style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
              >
                <span>{emoji}</span>
                <span>{mood.charAt(0).toUpperCase() + mood.slice(1)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {hasSearched ? (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold">
              {loading ? "Searching..." : `${results.length} results`}
            </h2>
            <div
              onClick={() => goTo("/")}
              className="text-xs text-accent cursor-pointer select-none"
              style={{ touchAction: "manipulation" }}
            >
              Clear
            </div>
          </div>

          {loading && (
            <div className="py-12 text-center text-muted">
              <div className="mb-2 text-2xl select-none">🍜</div>
              Finding your taste of home...
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="mb-2 text-2xl select-none">😕</div>
              <div className="text-sm text-muted">{error}</div>
            </div>
          )}

          {!loading && !error && results.length === 0 && (
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="mb-2 text-2xl select-none">🔍</div>
              <div className="text-sm font-medium">No results yet</div>
              <div className="mt-1 text-xs text-muted">Try searching for a dish, or pick a mood to explore</div>
            </div>
          )}

          <div className="space-y-3">
            {results.map((result) => (
              <SearchResultCard
                key={result.id}
                dish={{
                  nameEn: result.dish.nameEn,
                  emoji: result.dish.emoji,
                  nameNative: result.dish.nameNative,
                }}
                place={{
                  name: result.place.name,
                  type: result.place.type,
                  address: result.place.address,
                  city: result.place.city,
                }}
                authenticityScore={result.authenticityScore}
                priceRange={result.priceRange}
                verifiedByCount={result.verifiedByCount}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="mb-3 text-base font-semibold">Popular among HK immigrants</h2>
            <div className="grid grid-cols-2 gap-3">
              {POPULAR_DISHES.map((dish) => (
                <div
                  key={dish.nameEn}
                  onClick={() => {
                    console.log('[Dish] navigating to:', dish.nameEn);
                    goTo(`/?q=${encodeURIComponent(dish.nameEn)}`);
                  }}
                  className="flex flex-col items-start gap-1 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-accent cursor-pointer select-none text-left"
                  style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
                >
                  <span className="text-3xl">{dish.emoji}</span>
                  <span className="font-semibold text-sm leading-tight">{dish.nameEn}</span>
                  {dish.nameNative && (
                    <span className="text-xs text-muted">{dish.nameNative}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 text-sm font-medium">✨ New to London?</div>
            <p className="text-sm text-muted leading-relaxed">
              Start with a dish you miss, or tell us how you are feeling.
              We will show you where other Hong Kongers go.
            </p>
          </div>
        </>
      )}

      <footer className="mt-8 pb-6 text-center text-xs text-muted select-none">
        Taste of Home · Built with 💛 for immigrants everywhere
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}

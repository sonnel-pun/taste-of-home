"use client";

import { useState, useCallback } from "react";
import { MoodChip } from "@/components/ui/MoodChip";
import { DishCard } from "@/components/ui/DishCard";
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

export default function HomePage() {
  const { results, loading, error, hasSearched, search } = useSearch();
  const [searchInput, setSearchInput] = useState("");
  const [activeMood, setActiveMood] = useState<string | undefined>(undefined);

  const handleSearch = useCallback(
    (query?: string, mood?: string) => {
      search({ q: query || searchInput || undefined, mood });
    },
    [search, searchInput]
  );

  const handleMoodClick = useCallback(
    (mood: string) => {
      const newMood = activeMood === mood ? undefined : mood;
      setActiveMood(newMood);
      handleSearch(undefined, newMood);
    },
    [activeMood, handleSearch]
  );

  const handleDishClick = useCallback(
    (dishName: string) => {
      setSearchInput(dishName);
      search({ q: dishName });
    },
    [search]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="mx-auto max-w-md px-5 py-6">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">
            Taste
            <span className="text-accent">of</span>
            Home
          </h1>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-sm">
            👋
          </div>
        </div>
      </header>

      {/* Search */}
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-card px-4 py-3.5">
          <span className="text-muted">🔍</span>
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
        <div className="mb-2.5 text-xs font-medium uppercase tracking-wider text-muted">
          How are you feeling?
        </div>
        <div className="flex flex-wrap gap-2">
          {MOODS.map(({ mood, emoji }) => (
            <MoodChip
              key={mood}
              mood={mood.charAt(0).toUpperCase() + mood.slice(1)}
              emoji={emoji}
              active={activeMood === mood}
              onClick={() => handleMoodClick(mood)}
            />
          ))}
        </div>
      </div>

      {/* Content Area */}
      {hasSearched ? (
        <div>
          {/* Search Results */}
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold">
              {loading ? "Searching..." : `${results.length} results`}
            </h2>
            {hasSearched && (
              <button
                onClick={() => {
                  setSearchInput("");
                  setActiveMood(undefined);
                  search({});
                }}
                className="text-xs text-accent"
              >
                Clear
              </button>
            )}
          </div>

          {loading && (
            <div className="py-12 text-center text-muted">
              <div className="mb-2 text-2xl">🍜</div>
              Finding your taste of home...
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="mb-2 text-2xl">😕</div>
              <div className="text-sm text-muted">{error}</div>
            </div>
          )}

          {!loading && !error && results.length === 0 && (
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="mb-2 text-2xl">🔍</div>
              <div className="text-sm font-medium">No results yet</div>
              <div className="mt-1 text-xs text-muted">
                Try searching for a dish, or pick a mood to explore
              </div>
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
          {/* Popular Dishes Grid */}
          <div className="mb-6">
            <h2 className="mb-3 text-base font-semibold">Popular among HK immigrants</h2>
            <div className="grid grid-cols-2 gap-3">
              {POPULAR_DISHES.map((dish) => (
                <DishCard
                  key={dish.nameEn}
                  emoji={dish.emoji}
                  nameEn={dish.nameEn}
                  nameNative={dish.nameNative}
                  onClick={() => handleDishClick(dish.nameEn)}
                />
              ))}
            </div>
          </div>

          {/* Empty State / Onboarding */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 text-sm font-medium">✨ New to London?</div>
            <p className="text-sm text-muted leading-relaxed">
              Start with a dish you miss, or tell us how you are feeling. 
              We will show you where other Hong Kongers go.
            </p>
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="mt-8 pb-6 text-center text-xs text-muted">
        Taste of Home · Built with 💛 for immigrants everywhere
      </footer>
    </div>
  );
}

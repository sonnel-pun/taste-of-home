"use client";

import { useState, useCallback } from "react";

export interface SearchResult {
  id: string;
  authenticityScore: number;
  priceRange: string;
  servingStyle: string;
  verifiedByCount: number;
  notes: string;
  dish: {
    id: string;
    nameEn: string;
    nameNative: string;
    emoji: string;
    description: string;
    tags: string[];
  };
  place: {
    id: string;
    name: string;
    type: "restaurant" | "grocery";
    address: string;
    city: string;
    phone: string;
  };
  stories: {
    id: string;
    text: string;
    mood: string;
    likesCount: number;
    author: string;
  }[];
}

export interface SearchParams {
  q?: string;
  mood?: string;
  type?: "restaurant" | "grocery";
  lat?: number;
  lng?: number;
}

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const search = useCallback(async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const query = new URLSearchParams();
      if (params.q) query.set("q", params.q);
      if (params.mood) query.set("mood", params.mood);
      if (params.type) query.set("type", params.type);
      if (params.lat) query.set("lat", String(params.lat));
      if (params.lng) query.set("lng", String(params.lng));

      const res = await fetch(`/api/dishes/search?${query.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Search failed");
      }

      setResults(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, hasSearched, search };
}

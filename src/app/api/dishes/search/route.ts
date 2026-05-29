import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";

const searchSchema = z.object({
  q: z.string().optional(),
  mood: z.string().optional(),
  cuisine: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radius_km: z.coerce.number().default(10),
  type: z.enum(["restaurant", "grocery"]).optional(),
  min_score: z.coerce.number().min(0).max(100).optional(),
  limit: z.coerce.number().default(20),
  offset: z.coerce.number().default(0),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawParams = Object.fromEntries(searchParams.entries());
    const params = searchSchema.parse(rawParams);

    // Build base query on dish_places with joins
    let query = supabaseAdmin
      .from("dish_places")
      .select(
        `
        id,
        authenticity_score,
        price_range,
        serving_style,
        verified_by_count,
        notes,
        dishes (
          id, name_en, name_native, name_romanized, description, tags, emoji, image_url
        ),
        places (
          id, name, type, address, city, country, phone, coordinates, website
        ),
        stories (
          id, text, mood, likes_count,
          profiles (display_name)
        )
      `,
        { count: "exact" }
      )
      .limit(params.limit)
      .range(params.offset, params.offset + params.limit - 1);

    // Search by dish name - using dishes subquery approach
    if (params.q) {
      // First get matching dish IDs
      const { data: matchingDishes } = await supabaseAdmin
        .from("dishes")
        .select("id")
        .ilike("name_en", `%${params.q}%`);
      
      const { data: matchingNative } = await supabaseAdmin
        .from("dishes")
        .select("id")
        .ilike("name_native", `%${params.q}%`);

      const dishIds = new Set([
        ...(matchingDishes || []).map((d) => d.id),
        ...(matchingNative || []).map((d) => d.id),
      ]);

      if (dishIds.size > 0) {
        query = query.in("dish_id", Array.from(dishIds));
      }
    }

    // Filter by mood (via stories)
    if (params.mood) {
      // Get dish_place IDs that have stories with this mood
      const { data: storyMatches } = await supabaseAdmin
        .from("stories")
        .select("dish_place_id")
        .eq("mood", params.mood);

      const dpIds = new Set((storyMatches || []).map((s) => s.dish_place_id));
      
      if (dpIds.size > 0) {
        query = query.in("id", Array.from(dpIds));
      }
    }

    // Filter by place type
    if (params.type) {
      query = query.eq("places.type", params.type);
    }

    // Minimum authenticity score
    if (params.min_score !== undefined) {
      query = query.gte("authenticity_score", params.min_score);
    }

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Search failed", message: error.message },
        { status: 500 }
      );
    }

    // Transform to API response format
    const results = (data || []).map((row: any) => ({
      id: row.id,
      authenticityScore: row.authenticity_score,
      priceRange: row.price_range,
      servingStyle: row.serving_style,
      verifiedByCount: row.verified_by_count,
      notes: row.notes,
      dish: row.dishes || {},
      place: row.places || {},
      stories: (row.stories || []).map((s: any) => ({
        id: s.id,
        text: s.text,
        mood: s.mood,
        likesCount: s.likes_count,
        author: s.profiles?.display_name || "Anonymous",
      })),
    }));

    return NextResponse.json({
      data: results,
      count: count || results.length,
      query: {
        q: params.q,
        mood: params.mood,
        type: params.type,
        lat: params.lat,
        lng: params.lng,
        radius_km: params.radius_km,
      },
    });
  } catch (err) {
    console.error("Search error:", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid parameters", details: err.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Search failed", message: (err as Error).message },
      { status: 500 }
    );
  }
}

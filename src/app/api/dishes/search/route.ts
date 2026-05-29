import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // server-side only
);

const SearchSchema = z.object({
  q: z.string().optional(),           // dish name search
  mood: z.string().optional(),        // homesick | celebrating | comfort | nostalgic | excited
  cuisine: z.string().optional(),     // e.g., "Hong Kong"
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radius_km: z.coerce.number().default(10),
  type: z.enum(['restaurant', 'grocery']).optional(),
  min_score: z.coerce.number().min(0).max(100).optional(),
  limit: z.coerce.number().default(20),
  offset: z.coerce.number().default(0),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const parse = SearchSchema.safeParse(Object.fromEntries(searchParams));
  if (!parse.success) {
    return Response.json({ error: 'Invalid query', details: parse.error.format() }, { status: 400 });
  }
  
  const { q, mood, cuisine, lat, lng, radius_km, type, min_score, limit, offset } = parse.data;

  // Build the query
  let query = supabase
    .from('dish_places')
    .select(`
      id,
      authenticity_score,
      price_range,
      serving_style,
      verified_by_count,
      is_available,
      notes,
      dishes (
        id, name_en, name_native, emoji, description, tags
      ),
      places (
        id, name, type, address, city, phone, coordinates
      ),
      stories (
        id, text, mood, likes_count, profiles (display_name)
      )
    `)
    .eq('is_available', true)
    .order('authenticity_score', { ascending: false })
    .limit(limit)
    .range(offset, offset + limit - 1);

  // Text search on dish name
  if (q) {
    query = query.or(`dishes.name_en.ilike.%${q}%,dishes.name_native.ilike.%${q}%`);
  }

  // Filter by mood (via stories)
  if (mood) {
    query = query.eq('stories.mood', mood);
  }

  // Filter by place type
  if (type) {
    query = query.eq('places.type', type);
  }

  // Minimum authenticity score
  if (min_score !== undefined) {
    query = query.gte('authenticity_score', min_score);
  }

  // Geo filter (if coordinates provided)
  if (lat !== undefined && lng !== undefined) {
    // PostGIS: find places within radius
    const { data: nearbyPlaceIds, error: geoError } = await supabase.rpc(
      'places_within_radius',
      { lat, lng, radius_km }
    );
    
    if (!geoError && nearbyPlaceIds) {
      const ids = nearbyPlaceIds.map((p: { id: string }) => p.id);
      if (ids.length > 0) {
        query = query.in('places.id', ids);
      } else {
        // No places nearby — return empty
        return Response.json({ data: [], count: 0 });
      }
    }
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Search error:', error);
    return Response.json({ error: 'Search failed', message: error.message }, { status: 500 });
  }

  // Transform response for frontend
  const results = data?.map((dp: any) => ({
    id: dp.id,
    authenticityScore: dp.authenticity_score,
    priceRange: dp.price_range,
    servingStyle: dp.serving_style,
    verifiedByCount: dp.verified_by_count,
    notes: dp.notes,
    dish: dp.dishes,
    place: {
      ...dp.places,
      coordinates: dp.places?.coordinates,
    },
    stories: dp.stories?.map((s: any) => ({
      id: s.id,
      text: s.text,
      mood: s.mood,
      likesCount: s.likes_count,
      author: s.profiles?.display_name,
    })) || [],
  })) || [];

  return Response.json({
    data: results,
    count: count || results.length,
    query: { q, mood, lat, lng, radius_km, type, min_score },
  });
}

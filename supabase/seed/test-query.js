// Test query: verify database is seeded correctly
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  console.log('=== Testing Database Queries ===\n');

  // 1. Count dishes
  const { data: dishes, error: dErr } = await supabase.from('dishes').select('*');
  console.log(`Dishes: ${dishes?.length || 0} ${dErr ? '(error: ' + dErr.message + ')' : ''}`);

  // 2. Count places
  const { data: places, error: pErr } = await supabase.from('places').select('*');
  console.log(`Places: ${places?.length || 0} ${pErr ? '(error: ' + pErr.message + ')' : ''}`);

  // 3. Count dish_places
  const { data: dps, error: dpErr } = await supabase.from('dish_places').select('*');
  console.log(`Dish-Place links: ${dps?.length || 0} ${dpErr ? '(error: ' + dpErr.message + ')' : ''}`);

  // 4. Count profiles
  const { data: profiles, error: prErr } = await supabase.from('profiles').select('*');
  console.log(`Profiles: ${profiles?.length || 0} ${prErr ? '(error: ' + prErr.message + ')' : ''}`);

  // 5. Count stories
  const { data: stories, error: sErr } = await supabase.from('stories').select('*');
  console.log(`Stories: ${stories?.length || 0} ${sErr ? '(error: ' + sErr.message + ')' : ''}`);

  // 6. Test JOIN: dishes + places + stories
  console.log('\n--- JOIN Query: Char Siu places with stories ---');
  const { data: result, error: jErr } = await supabase
    .from('dishes')
    .select(`
      name_en,
      emoji,
      dish_places (
        authenticity_score,
        price_range,
        places (name, type, address),
        stories (text, mood, likes_count, profiles (display_name))
      )
    `)
    .eq('name_en', 'Char Siu')
    .single();

  if (jErr) {
    console.error('JOIN error:', jErr.message);
  } else {
    console.log(`Dish: ${result.emoji} ${result.name_en}`);
    result.dish_places?.forEach(dp => {
      console.log(`  → ${dp.places?.name} (${dp.places?.type}) — ${dp.authenticity_score}% authentic`);
      dp.stories?.forEach(s => {
        console.log(`     Story by ${s.profiles?.display_name}: "${s.text.substring(0, 60)}..." (${s.likes_count} likes)`);
      });
    });
  }

  // 7. Test geo query: places near a London coordinate
  console.log('\n--- Geo Query: Places near Queensway ---');
  const { data: nearby, error: gErr } = await supabase.rpc('nearby_places', {
    lat: 51.5103,
    lng: -0.1887,
    radius_km: 5
  });

  if (gErr) {
    console.log('  (Note: nearby_places RPC not created yet — this is expected for now)');
  } else {
    nearby?.forEach(p => console.log(`  → ${p.name} (${p.distance_m}m away)`));
  }

  console.log('\n=== Test Complete ===');
}

test().catch(console.error);

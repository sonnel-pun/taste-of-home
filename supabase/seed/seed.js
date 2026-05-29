// =============================================
// Seed Script: Creates auth users + all data
// Run: node supabase/seed/seed.js
// Requires: .env.local with SUPABASE_SERVICE_ROLE_KEY
// =============================================

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const USERS = [
  { email: 'seed-wai@tasteofhome.local', password: 'seed-password-123', name: 'Wai', origin: 'Hong Kong', year: 2021, reputation: 47 },
  { email: 'seed-kaming@tasteofhome.local', password: 'seed-password-123', name: 'Ka Ming', origin: 'Hong Kong', year: 2019, reputation: 23 },
  { email: 'seed-suki@tasteofhome.local', password: 'seed-password-123', name: 'Suki', origin: 'Hong Kong', year: 2020, reputation: 18 },
];

const STORY_TEXTS = {
  wai: "My dad used to take me to a dai pai dong in Sham Shui Po for char siu on Saturday mornings. We'd sit on plastic stools, him with his newspaper, me with my rice box. The first time I tasted Gold Mine's char siu, I was driving back from Queensway and I had to pull over. It wasn't exactly the same — thicker cut, glaze a bit sweeter — but the char, the caramelization, it took me straight back. I sat there in my car and cried for ten minutes. I go back when I miss him. It's been three years.",
  
  kaming: "Back in HK, my grandma would make wontons from scratch every Sunday. Shrimp, pork, a touch of sesame oil, wrapped in thin skin. She passed away last year and I never learned the recipe. Cafe TPT's wonton noodles are the closest I've found — the broth has that depth, the noodles have that spring. I bring friends here when they ask what HK food is like. It's my way of keeping her memory alive.",
  
  suki: "The first winter in London hit me harder than expected. Short days, grey skies, no one to have yum cha with. I found Cafe TPT on a whim and ordered milk tea. When that first sip hit — strong, bitter, tempered with evaporated milk — I felt something unlock. It was like someone wrapped a blanket around me. Now I go every Tuesday morning. It's my ritual.",
};

async function seed() {
  console.log('=== Taste of Home Seed Script ===\n');
  
  // Step 1: Get or create auth users
  console.log('Step 1: Ensuring auth users exist...');
  const createdUsers = [];
  
  for (const u of USERS) {
    const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('  Failed to list users:', listError.message);
      continue;
    }
    
    const existing = listData.users.find(user => user.email === u.email);
    
    if (existing) {
      console.log(`  Found existing: ${u.name} → ${existing.id}`);
      createdUsers.push({ ...u, id: existing.id });
      continue;
    }
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
    });
    
    if (error) {
      console.error(`  Failed to create ${u.name}:`, error.message);
      continue;
    }
    
    console.log(`  Created: ${u.name} → ${data.user.id}`);
    createdUsers.push({ ...u, id: data.user.id });
  }
  
  if (createdUsers.length === 0) {
    console.error('\n❌ No users available. Cannot seed stories.');
    process.exit(1);
  }
  
  // Step 2: Upsert profiles
  console.log('\nStep 2: Upserting profiles...');
  
  for (const u of createdUsers) {
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', u.id)
      .single();
    
    const profileData = {
      id: u.id,
      display_name: u.name,
      origin_country: u.origin,
      immigration_year: u.year,
      verified_native: true,
      reputation: u.reputation,
    };
    
    if (existingProfile) {
      const { error } = await supabase.from('profiles').update(profileData).eq('id', u.id);
      if (error) console.error(`  Failed to update ${u.name}:`, error.message);
      else console.log(`  Updated profile: ${u.name}`);
    } else {
      const { error } = await supabase.from('profiles').insert(profileData);
      if (error) console.error(`  Failed to insert ${u.name}:`, error.message);
      else console.log(`  Inserted profile: ${u.name}`);
    }
  }
  
  // Step 3: Get dish_place IDs
  console.log('\nStep 3: Fetching dish-place IDs...');
  const { data: dishPlaces, error: dpError } = await supabase
    .from('dish_places')
    .select('id, dishes(name_en), places(name)');
  
  if (dpError) {
    console.error('  Failed:', dpError.message);
    process.exit(1);
  }
  
  console.log(`  Found ${dishPlaces?.length || 0} dish-place links`);
  
  const findDP = (dishName, placeName) => {
    const dp = dishPlaces.find(d => 
      d.dishes?.name_en === dishName && d.places?.name === placeName
    );
    if (!dp) console.error(`    WARNING: not found: ${dishName} @ ${placeName}`);
    return dp?.id;
  };
  
  // Step 4: Insert stories
  console.log('\nStep 4: Inserting stories...');
  
  const stories = [
    {
      user_id: createdUsers[0].id,
      dish_place_id: findDP('Char Siu', 'Gold Mine 金山樓'),
      text: STORY_TEXTS.wai,
      mood: 'homesick',
      arrival_year: 2021,
      hometown: 'Sham Shui Po, Hong Kong',
      likes_count: 142,
    },
    {
      user_id: createdUsers[1].id,
      dish_place_id: findDP('Wonton Noodles', 'Cafe TPT 大排档'),
      text: STORY_TEXTS.kaming,
      mood: 'nostalgic',
      arrival_year: 2019,
      hometown: 'Yuen Long, Hong Kong',
      likes_count: 89,
    },
    {
      user_id: createdUsers[2].id,
      dish_place_id: findDP('Hong Kong Milk Tea', 'Cafe TPT 大排档'),
      text: STORY_TEXTS.suki,
      mood: 'comfort',
      arrival_year: 2020,
      hometown: 'Causeway Bay, Hong Kong',
      likes_count: 67,
    },
  ];
  
  let successCount = 0;
  
  for (const story of stories) {
    if (!story.dish_place_id) {
      console.log('  ⏭️  Skipping story (dish-place not found)');
      continue;
    }
    
    const { data: existing } = await supabase
      .from('stories')
      .select('id')
      .eq('user_id', story.user_id)
      .eq('dish_place_id', story.dish_place_id)
      .maybeSingle();
    
    if (existing) {
      const { error } = await supabase
        .from('stories')
        .update({ text: story.text, mood: story.mood, likes_count: story.likes_count })
        .eq('id', existing.id);
      
      if (error) console.error('  Failed to update:', error.message);
      else { console.log('  ✅ Updated story'); successCount++; }
    } else {
      const { error } = await supabase.from('stories').insert(story);
      if (error) console.error('  Failed to insert:', error.message);
      else { console.log('  ✅ Inserted story'); successCount++; }
    }
  }
  
  console.log(`\n=== Seed Complete: ${successCount}/${stories.length} stories seeded ===`);
}

seed().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

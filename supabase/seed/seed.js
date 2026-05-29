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

const users = [
  { email: 'seed-wai@tasteofhome.local', password: 'seed-password-123', name: 'Wai', origin: 'Hong Kong', year: 2021 },
  { email: 'seed-kaming@tasteofhome.local', password: 'seed-password-123', name: 'Ka Ming', origin: 'Hong Kong', year: 2019 },
  { email: 'seed-suki@tasteofhome.local', password: 'seed-password-123', name: 'Suki', origin: 'Hong Kong', year: 2020 },
];

async function seed() {
  console.log('Creating auth users...');
  const createdUsers = [];
  
  for (const u of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
    });
    
    if (error) {
      console.error('Failed to create user', u.email, error.message);
      continue;
    }
    
    createdUsers.push({ ...u, id: data.user.id });
    console.log('  Created:', u.name, '→', data.user.id);
  }

  console.log('\nInserting profiles...');
  for (const u of createdUsers) {
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: u.id,
        display_name: u.name,
        origin_country: u.origin,
        immigration_year: u.year,
        verified_native: true,
        reputation: u.name === 'Wai' ? 47 : u.name === 'Ka Ming' ? 23 : 18,
      });
    
    if (error) console.error('Profile insert failed:', error.message);
  }

  console.log('\nGetting dish_place IDs...');
  const { data: dishPlaces, error: dpError } = await supabase
    .from('dish_places')
    .select('id, dishes(name_en), places(name)');
  
  if (dpError) {
    console.error('Failed to fetch dish_places:', dpError.message);
    process.exit(1);
  }

  const findDP = (dishName, placeName) => {
    const dp = dishPlaces.find(d => 
      d.dishes?.name_en === dishName && d.places?.name === placeName
    );
    return dp?.id;
  };

  console.log('\nInserting stories...');
  const stories = [
    {
      user_id: createdUsers[0].id,
      dish_place_id: findDP('Char Siu', 'Gold Mine 金山樓'),
      text: 'My dad used to take me to a dai pai dong in Sham Shui Po for char siu on Saturday mornings. We\'d sit on plastic stools, him with his newspaper, me with my rice box. The first time I tasted Gold Mine\'s char siu, I was driving back from Queensway and I had to pull over. It wasn\'t exactly the same — thicker cut, glaze a bit sweeter — but the char, the caramelization, it took me straight back. I sat there in my car and cried for ten minutes. I go back when I miss him. It\'s been three years.',
      mood: 'homesick',
      arrival_year: 2021,
      hometown: 'Sham Shui Po, Hong Kong',
      likes_count: 142,
    },
    {
      user_id: createdUsers[1].id,
      dish_place_id: findDP('Wonton Noodles', 'Cafe TPT 大排档'),
      text: 'Back in HK, my grandma would make wontons from scratch every Sunday. Shrimp, pork, a touch of sesame oil, wrapped in thin skin. She passed away last year and I never learned the recipe. Cafe TPT\'s wonton noodles are the closest I\'ve found — the broth has that depth, the noodles have that spring. I bring friends here when they ask what HK food is like. It\'s my way of keeping her memory alive.',
      mood: 'nostalgic',
      arrival_year: 2019,
      hometown: 'Yuen Long, Hong Kong',
      likes_count: 89,
    },
    {
      user_id: createdUsers[2].id,
      dish_place_id: findDP('Hong Kong Milk Tea', 'Cafe TPT 大排档'),
      text: 'The first winter in London hit me harder than expected. Short days, grey skies, no one to have yum cha with. I found Cafe TPT on a whim and ordered milk tea. When that first sip hit — strong, bitter, tempered with evaporated milk — I felt something unlock. It was like someone wrapped a blanket around me. Now I go every Tuesday morning. It\'s my ritual.',
      mood: 'comfort',
      arrival_year: 2020,
      hometown: 'Causeway Bay, Hong Kong',
      likes_count: 67,
    },
  ];

  for (const story of stories) {
    if (!story.dish_place_id) {
      console.error('Missing dish_place_id for story, skipping');
      continue;
    }
    const { error } = await supabase.from('stories').insert(story);
    if (error) console.error('Story insert failed:', error.message);
  }

  console.log('\n✅ Seed complete!');
  console.log('You can delete these seed users later from Supabase Dashboard → Auth');
}

seed().catch(console.error);

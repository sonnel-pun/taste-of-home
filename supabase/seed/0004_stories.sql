-- =============================================
-- Seed: Stories (emotional narratives)
-- =============================================

-- First, create a placeholder profile for story authors
-- In production, these would be real auth.users
INSERT INTO profiles (id, display_name, origin_country, immigration_year, verified_native, reputation)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Wai', 'Hong Kong', 2021, TRUE, 47),
  ('00000000-0000-0000-0000-000000000002', 'Ka Ming', 'Hong Kong', 2019, TRUE, 23),
  ('00000000-0000-0000-0000-000000000003', 'Suki', 'Hong Kong', 2020, TRUE, 18);

-- Story 1: Char Siu at Gold Mine
INSERT INTO stories (user_id, dish_place_id, text, mood, arrival_year, hometown, verified, likes_count)
SELECT 
  '00000000-0000-0000-0000-000000000001',
  dp.id,
  'My dad used to take me to a dai pai dong in Sham Shui Po for char siu on Saturday mornings. We''d sit on plastic stools, him with his newspaper, me with my rice box. The first time I tasted Gold Mine''s char siu, I was driving back from Queensway and I had to pull over. It wasn''t exactly the same — thicker cut, glaze a bit sweeter — but the char, the caramelization, it took me straight back. I sat there in my car and cried for ten minutes. I go back when I miss him. It''s been three years.',
  'homesick',
  2021,
  'Sham Shui Po, Hong Kong',
  TRUE,
  142
FROM dish_places dp
JOIN dishes d ON dp.dish_id = d.id
JOIN places p ON dp.place_id = p.id
WHERE d.name_en = 'Char Siu' AND p.name = 'Gold Mine 金山樓';

-- Story 2: Wonton Noodles at Cafe TPT
INSERT INTO stories (user_id, dish_place_id, text, mood, arrival_year, hometown, verified, likes_count)
SELECT 
  '00000000-0000-0000-0000-000000000002',
  dp.id,
  'Back in HK, my grandma would make wontons from scratch every Sunday. Shrimp, pork, a touch of sesame oil, wrapped in thin skin. She passed away last year and I never learned the recipe. Cafe TPT''s wonton noodles are the closest I''ve found — the broth has that depth, the noodles have that spring. I bring friends here when they ask what HK food is like. It''s my way of keeping her memory alive.',
  'nostalgic',
  2019,
  'Yuen Long, Hong Kong',
  TRUE,
  89
FROM dish_places dp
JOIN dishes d ON dp.dish_id = d.id
JOIN places p ON dp.place_id = p.id
WHERE d.name_en = 'Wonton Noodles' AND p.name = 'Cafe TPT 大排档';

-- Story 3: Milk tea comfort
INSERT INTO stories (user_id, dish_place_id, text, mood, arrival_year, hometown, verified, likes_count)
SELECT 
  '00000000-0000-0000-0000-000000000003',
  dp.id,
  'The first winter in London hit me harder than expected. Short days, grey skies, no one to have yum cha with. I found Cafe TPT on a whim and ordered milk tea. When that first sip hit — strong, bitter, tempered with evaporated milk — I felt something unlock. It was like someone wrapped a blanket around me. Now I go every Tuesday morning. It''s my ritual.',
  'comfort',
  2020,
  'Causeway Bay, Hong Kong',
  TRUE,
  67
FROM dish_places dp
JOIN dishes d ON dp.dish_id = d.id
JOIN places p ON dp.place_id = p.id
WHERE d.name_en = 'Hong Kong Milk Tea' AND p.name = 'Cafe TPT 大排档';

-- =============================================
-- Seed: Cuisines and Dishes (Hong Kong → UK MVP)
-- =============================================

INSERT INTO cuisines (name_en, name_native, origin_country, emoji, description) VALUES
  ('Hong Kong', '香港', 'Hong Kong', '🇭🇰', 'Cantonese-influenced street food and tea culture'),
  ('Taiwanese', '台灣', 'Taiwan', '🇹🇼', 'Night market classics and comfort food');

INSERT INTO dishes (name_en, name_native, name_romanized, cuisine_id, description, tags, emoji) VALUES
  -- Hong Kong dishes
  ('Char Siu', '叉燒', 'caa1 siu1', (SELECT id FROM cuisines WHERE name_en = 'Hong Kong'), 
   'Honey-glazed barbecued pork, caramelized and slightly charred', 
   ARRAY['comfort', 'street_food', 'classic'], '🍖'),
  
  ('Wonton Noodles', '鮮蝦雲吞麵', 'sin1 haa1 wan4 tan1 min6', (SELECT id FROM cuisines WHERE name_en = 'Hong Kong'),
   'Silky egg noodles with shrimp dumplings in clear broth',
   ARRAY['comfort', 'classic', 'quick'], '🍜'),
  
  ('Hong Kong Milk Tea', '港式奶茶', 'gong2 sik1 naai5 caa4', (SELECT id FROM cuisines WHERE name_en = 'Hong Kong'),
   'Strong black tea strained through silk stocking, with evaporated milk',
   ARRAY['comfort', 'daily', 'classic'], '🧋'),
  
  ('HK French Toast', '西多士', 'sai1 do1 si6', (SELECT id FROM cuisines WHERE name_en = 'Hong Kong'),
   'Thick-cut bread, peanut butter filled, egg-dipped, deep fried, served with condensed milk',
   ARRAY['comfort', 'indulgent', 'breakfast'], '🍞'),
  
  ('Egg Tart', '蛋撻', 'daan6 taat3', (SELECT id FROM cuisines WHERE name_en = 'Hong Kong'),
   'Flaky pastry with rich egg custard, baked until caramelized on top',
   ARRAY['comfort', 'sweet', 'classic'], '🥧'),
  
  ('Curry Fishballs', '咖哩魚蛋', 'gaa3 lei1 jyu4 daan2', (SELECT id FROM cuisines WHERE name_en = 'Hong Kong'),
   'Fishballs simmered in mild curry sauce, street food staple',
   ARRAY['street_food', 'spicy', 'quick'], '🍡'),
  
  ('Pineapple Bun', '菠蘿包', 'bo1 lo4 baau1', (SELECT id FROM cuisines WHERE name_en = 'Hong Kong'),
   'Sweet bun with crunchy sugar crust, no actual pineapple',
   ARRAY['comfort', 'sweet', 'breakfast'], '🥯'),
  
  ('Siu Yuk', '燒肉', 'siu1 juk6', (SELECT id FROM cuisines WHERE name_en = 'Hong Kong'),
   'Crispy roast pork belly with five-spice and salt crackling',
   ARRAY['celebration', 'classic', 'shared'], '🥓'),
  
  ('Claypot Rice', '煲仔飯', 'bou1 zai2 faan6', (SELECT id FROM cuisines WHERE name_en = 'Hong Kong'),
   'Rice cooked in claypot with Chinese sausage, chicken, and soy sauce',
   ARRAY['comfort', 'winter', 'classic'], '🍚');

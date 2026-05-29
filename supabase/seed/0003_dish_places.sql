-- =============================================
-- Seed: Dish-Place Junction (authenticity scores)
-- =============================================

-- Gold Mine dishes
INSERT INTO dish_places (dish_id, place_id, authenticity_score, price_range, serving_style, verified_by_count, notes)
SELECT 
  d.id, p.id, 92, '$$', 'plate', 47,
  'Thick cut, honey glaze is correct. Ask for thin cut if you want HK-style.'
FROM dishes d, places p
WHERE d.name_en = 'Char Siu' AND p.name = 'Gold Mine 金山樓';

INSERT INTO dish_places (dish_id, place_id, authenticity_score, price_range, serving_style, verified_by_count, notes)
SELECT d.id, p.id, 88, '$$', 'plate', 32, 'Good crackling, slightly less five-spice than HK.'
FROM dishes d, places p
WHERE d.name_en = 'Siu Yuk' AND p.name = 'Gold Mine 金山樓';

-- Four Seasons dishes
INSERT INTO dish_places (dish_id, place_id, authenticity_score, price_range, serving_style, verified_by_count, notes)
SELECT d.id, p.id, 78, '$$$', 'plate', 23, 'Good but sweeter than HK style. Premium pricing.'
FROM dishes d, places p
WHERE d.name_en = 'Char Siu' AND p.name = 'Four Seasons 文興酒家';

INSERT INTO dish_places (dish_id, place_id, authenticity_score, price_range, serving_style, verified_by_count, notes)
SELECT d.id, p.id, 85, '$$$', 'bowl', 18, 'Classic Cantonese roast duck, very popular.'
FROM dishes d, places p
WHERE d.name_en = 'Siu Yuk' AND p.name = 'Four Seasons 文興酒家';

-- Cafe TPT
INSERT INTO dish_places (dish_id, place_id, authenticity_score, price_range, serving_style, verified_by_count, notes)
SELECT d.id, p.id, 90, '$', 'bowl', 41, 'Best wonton noodles in London. Springy noodles, proper broth.'
FROM dishes d, places p
WHERE d.name_en = 'Wonton Noodles' AND p.name = 'Cafe TPT 大排档';

INSERT INTO dish_places (dish_id, place_id, authenticity_score, price_range, serving_style, verified_by_count, notes)
SELECT d.id, p.id, 87, '$', 'plate', 35, 'Crispy outside, peanut butter oozing. Condensed milk on the side.'
FROM dishes d, places p
WHERE d.name_en = 'HK French Toast' AND p.name = 'Cafe TPT 大排档';

INSERT INTO dish_places (dish_id, place_id, authenticity_score, price_range, serving_style, verified_by_count, notes)
SELECT d.id, p.id, 89, '$', 'cup', 38, 'Proper silk stocking tea. Strong, not too sweet.'
FROM dishes d, places p
WHERE d.name_en = 'Hong Kong Milk Tea' AND p.name = 'Cafe TPT 大排档';

-- SeeWoo (grocery — DIY items)
INSERT INTO dish_places (dish_id, place_id, authenticity_score, price_range, serving_style, verified_by_count, notes)
SELECT d.id, p.id, 0, '$', 'raw ingredients', 15, 'Lee Kum Kee char siu sauce, pork belly, five-spice powder.'
FROM dishes d, places p
WHERE d.name_en = 'Char Siu' AND p.name = 'SeeWoo Supermarket';

-- Loon Fung (grocery)
INSERT INTO dish_places (dish_id, place_id, authenticity_score, price_range, serving_style, verified_by_count, notes)
SELECT d.id, p.id, 0, '$', 'raw ingredients', 12, 'Frozen wonton wrappers, shrimp, egg noodles, chicken broth powder.'
FROM dishes d, places p
WHERE d.name_en = 'Wonton Noodles' AND p.name = 'Loon Fung';

-- New China
INSERT INTO dish_places (dish_id, place_id, authenticity_score, price_range, serving_style, verified_by_count, notes)
SELECT d.id, p.id, 75, '$$', 'plate', 14, 'Decent but not outstanding. Good for Chinatown convenience.'
FROM dishes d, places p
WHERE d.name_en = 'Char Siu' AND p.name = 'New China 新興酒家';

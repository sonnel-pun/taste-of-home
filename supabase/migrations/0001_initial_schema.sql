-- =============================================
-- Taste of Home — Initial Database Schema
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =============================================
-- Core Tables
-- =============================================

-- Cuisine types (HK, Taiwanese, Korean, etc.)
CREATE TABLE cuisines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL,
  name_native TEXT,
  origin_country TEXT NOT NULL,
  emoji TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual dishes (e.g., "Char Siu", "Wonton Noodles")
CREATE TABLE dishes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL,
  name_native TEXT NOT NULL,
  name_romanized TEXT,
  cuisine_id UUID REFERENCES cuisines(id) ON DELETE SET NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',  -- ['comfort', 'street_food', 'celebration']
  emoji TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Places: restaurants OR grocery stores
CREATE TABLE places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('restaurant', 'grocery')),
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'London',
  country TEXT NOT NULL DEFAULT 'United Kingdom',
  coordinates GEOGRAPHY(POINT, 4326),  -- PostGIS for geo queries
  phone TEXT,
  website TEXT,
  opening_hours JSONB,  -- { mon: '09:00-22:00', ... }
  verified BOOLEAN DEFAULT FALSE,
  created_by UUID,  -- references auth.users later
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction: which dishes are served at which places
-- This carries the authenticity scoring — the heart of the product
CREATE TABLE dish_places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  authenticity_score INT CHECK (authenticity_score >= 0 AND authenticity_score <= 100),
  price_range TEXT CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
  serving_style TEXT,  -- "plate", "bowl", "takeaway box", etc.
  verified_by_count INT DEFAULT 0,  -- how many native reviewers
  is_available BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(dish_id, place_id)
);

-- Users (extends Supabase auth.users via trigger)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  origin_country TEXT,
  immigration_year INT,
  verified_native BOOLEAN DEFAULT FALSE,  -- manual or document check
  reputation INT DEFAULT 0,  -- from helpful reviews/stories
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews: structured ratings by users
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dish_place_id UUID NOT NULL REFERENCES dish_places(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  authenticity_rating INT CHECK (authenticity_rating >= 1 AND authenticity_rating <= 5),
  text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stories: emotional narratives tied to a dish at a specific place
-- This is what makes the app different from Yelp
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dish_place_id UUID NOT NULL REFERENCES dish_places(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  mood TEXT CHECK (mood IN ('homesick', 'celebrating', 'comfort', 'nostalgic', 'excited')),
  arrival_year INT,  -- when did they immigrate?
  hometown TEXT,     -- "Sham Shui Po", "Taipei", etc.
  verified BOOLEAN DEFAULT FALSE,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photos: user-contributed images of dishes
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dish_place_id UUID NOT NULL REFERENCES dish_places(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookmarks: users save dish-place combos
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dish_place_id UUID NOT NULL REFERENCES dish_places(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, dish_place_id)
);

-- =============================================
-- Indexes for Performance
-- =============================================

CREATE INDEX idx_places_coordinates ON places USING GIST(coordinates);
CREATE INDEX idx_places_city ON places(city);
CREATE INDEX idx_places_type ON places(type);
CREATE INDEX idx_dishes_cuisine ON dishes(cuisine_id);
CREATE INDEX idx_dish_places_dish ON dish_places(dish_id);
CREATE INDEX idx_dish_places_place ON dish_places(place_id);
CREATE INDEX idx_dish_places_score ON dish_places(authenticity_score DESC);
CREATE INDEX idx_reviews_dish_place ON reviews(dish_place_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_stories_dish_place ON stories(dish_place_id);
CREATE INDEX idx_stories_mood ON stories(mood);
CREATE INDEX idx_stories_user ON stories(user_id);

-- =============================================
-- Triggers: Auto-update timestamps
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_places_updated_at BEFORE UPDATE ON places
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dish_places_updated_at BEFORE UPDATE ON dish_places
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- RLS: Row Level Security (basic setup)
-- =============================================

ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE dish_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Everyone can read
CREATE POLICY "Public read access" ON dishes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON places FOR SELECT USING (true);
CREATE POLICY "Public read access" ON dish_places FOR SELECT USING (true);
CREATE POLICY "Public read access" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public read access" ON stories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON photos FOR SELECT USING (true);

-- Users can only modify their own data
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stories" ON stories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stories" ON stories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own stories" ON stories FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON bookmarks FOR DELETE USING (auth.uid() = user_id);

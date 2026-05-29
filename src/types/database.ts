// =============================================
// Supabase Database Types (generated manually for now)
// Run: npx supabase gen types typescript --project-id <your-project-id> > src/types/database.ts
// =============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      cuisines: {
        Row: {
          id: string;
          name_en: string;
          name_native: string | null;
          origin_country: string;
          emoji: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['cuisines']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['cuisines']['Insert']>;
      };
      dishes: {
        Row: {
          id: string;
          name_en: string;
          name_native: string;
          name_romanized: string | null;
          cuisine_id: string | null;
          description: string | null;
          tags: string[];
          emoji: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['dishes']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['dishes']['Insert']>;
      };
      places: {
        Row: {
          id: string;
          name: string;
          type: 'restaurant' | 'grocery';
          address: string;
          city: string;
          country: string;
          coordinates: unknown | null;  // PostGIS geometry
          phone: string | null;
          website: string | null;
          opening_hours: Json | null;
          verified: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['places']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['places']['Insert']>;
      };
      dish_places: {
        Row: {
          id: string;
          dish_id: string;
          place_id: string;
          authenticity_score: number | null;
          price_range: '$' | '$$' | '$$$' | '$$$$' | null;
          serving_style: string | null;
          verified_by_count: number;
          is_available: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['dish_places']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['dish_places']['Insert']>;
      };
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          origin_country: string | null;
          immigration_year: number | null;
          verified_native: boolean;
          reputation: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          dish_place_id: string;
          rating: number | null;
          authenticity_rating: number | null;
          text: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
      };
      stories: {
        Row: {
          id: string;
          user_id: string;
          dish_place_id: string;
          text: string;
          mood: 'homesick' | 'celebrating' | 'comfort' | 'nostalgic' | 'excited' | null;
          arrival_year: number | null;
          hometown: string | null;
          verified: boolean;
          likes_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['stories']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['stories']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

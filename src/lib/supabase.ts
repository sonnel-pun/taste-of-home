import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client (for browser use)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (for server components / API routes)
// Uses service role key for admin operations
export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient<Database>(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : supabase;

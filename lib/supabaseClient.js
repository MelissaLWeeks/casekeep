import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const globalForSupabase = globalThis;

export const supabase =
  globalForSupabase.supabaseClient ||
  createClient(supabaseUrl, supabaseAnonKey);

if (process.env.NODE_ENV !== "production") {
  globalForSupabase.supabaseClient = supabase;
}
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing. Check your .env.local file.");
}

if (supabaseAnonKey && !supabaseAnonKey.startsWith('eyJ')) {
    console.error("CRITICAL: Your Supabase Anon Key seems to be in the wrong format. It should be a long string starting with 'eyJ'. Your current key starts with:", supabaseAnonKey.substring(0, 10));
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

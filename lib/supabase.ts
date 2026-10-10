import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://omgxvchbydwjlfzwcvqx.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tZ3h2Y2hieWR3amxmendjdnF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2MjEyMzAsImV4cCI6MjEwNzE5NzIzMH0.xaHMPVF5oRmd48AeMozPbfi3oaGue-b6Uymk9R_JtkI";

// Instance Supabase Client tunggal untuk seluruh aplikasi
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

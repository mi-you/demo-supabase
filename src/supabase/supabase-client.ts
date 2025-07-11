import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export const supabaseClient = createClient<
  Database,
  { PostgrestVersion: "12" }
>(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

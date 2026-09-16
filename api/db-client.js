import { createClient } from '@supabase/supabase-js';

// Server-side only. Uses the SERVICE ROLE key (bypasses RLS) — this module
// must never be imported by frontend code.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default supabase;

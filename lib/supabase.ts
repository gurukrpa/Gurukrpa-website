import { createClient } from '@supabase/supabase-js'

// Public client: safe to use on the client and server (uses anon key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Note: Admin client must only be used on the server. See `lib/supabaseAdmin.ts`.

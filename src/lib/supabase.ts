import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Env-gated: when Supabase isn't configured (no URL/key), the app falls back to
// local-first and nothing here runs. The publishable/anon key is public by
// design; RLS protects the data.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | undefined = supabaseConfigured
  ? createClient(url as string, anonKey as string)
  : undefined

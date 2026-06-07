import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export type SupabaseAdmin = SupabaseClient

// 用於 Cloudflare Workers：從 Hono context 獲取
export const getSupabaseAdmin = (c: { get: (key: string) => unknown }): SupabaseAdmin => {
  return c.get('supabaseAdmin') as SupabaseAdmin
}

// 用於本地開發（Node.js）：從 process.env 初始化
export const createLocalSupabaseAdmin = (): SupabaseAdmin => {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

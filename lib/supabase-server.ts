/**
 * Supabase Server Client
 *
 * Для использования в Server Components и API routes
 *
 * Пример:
 * ```tsx
 * import { createServerSupabaseClient } from '@/lib/supabase-server'
 *
 * export default async function Page() {
 *   const supabase = await createServerSupabaseClient()
 *   const { data } = await supabase.from('table').select()
 * }
 * ```
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Environment variables with fallbacks for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

/**
 * Server client for Server Components and API routes
 *
 * @returns Supabase server client with cookie management
 *
 * @example
 * ```tsx
 * // Server Component
 * import { createServerSupabaseClient } from '@/lib/supabase-server'
 *
 * export default async function Page() {
 *   const supabase = await createServerSupabaseClient()
 *   const { data: { user } } = await supabase.auth.getUser()
 * }
 * ```
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set(name, value, options)
      },
      remove(name: string, options: any) {
        cookieStore.set(name, '', options)
      },
    },
  })
}

// Re-export for convenience
export { supabaseUrl, supabaseAnonKey }

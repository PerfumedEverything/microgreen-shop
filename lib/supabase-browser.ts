/**
 * Supabase Browser Client
 *
 * Для использования в Client Components
 *
 * Пример:
 * ```tsx
 * 'use client'
 * import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
 *
 * export default function Page() {
 *   const supabase = createBrowserSupabaseClient()
 *   // ...
 * }
 * ```
 */

import { createBrowserClient } from '@supabase/ssr'

// Environment variables with fallbacks for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

/**
 * Browser client for Client Components
 *
 * @returns Supabase browser client
 *
 * @example
 * ```tsx
 * 'use client'
 * import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
 *
 * export default function Page() {
 *   const supabase = createBrowserSupabaseClient()
 *
 *   useEffect(() => {
 *     const loadData = async () => {
 *       const { data } = await supabase.from('table').select()
 *     }
 *     loadData()
 *   }, [])
 * }
 * ```
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Re-export for convenience
export { supabaseUrl, supabaseAnonKey }

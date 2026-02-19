/**
 * Supabase Client Configuration
 *
 * This module provides Supabase clients for different contexts:
 * - Browser client: For use in Client Components
 * - Admin client: For server-side admin operations (bypasses RLS)
 *
 * ⚠️ For Server Components, use '@/lib/supabase-server' directly
 *
 * @example
 * ```tsx
 * // Client Component
 * 'use client'
 * import { createBrowserSupabaseClient } from '@/lib/supabase'
 * const supabase = createBrowserSupabaseClient()
 * ```
 *
 * @example
 * ```tsx
 * // Server Component
 * import { createServerSupabaseClient } from '@/lib/supabase-server'
 * const supabase = await createServerSupabaseClient()
 * ```
 */

// Re-export browser client (safe for client components)
export {
  createBrowserSupabaseClient,
  supabaseUrl,
  supabaseAnonKey,
} from "./supabase-browser";

/**
 * Admin client for server-side operations
 * Bypasses RLS policies - use with caution!
 *
 * @example
 * ```tsx
 * import { createAdminSupabaseClient } from '@/lib/supabase'
 *
 * export async function POST() {
 *   const supabase = createAdminSupabaseClient()
 *   // Admin operations here
 * }
 * ```
 */
export function createAdminSupabaseClient() {
  const { createClient } = require("@supabase/supabase-js");

  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';

  if (!supabaseServiceKey || supabaseServiceKey === '') {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not set, admin operations will fail');
  }

  return createClient(supabaseUrl, supabaseServiceKey || 'placeholder-key', {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

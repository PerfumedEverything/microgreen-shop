/**
 * Supabase Database Types
 * 
 * Generated from database schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          price: number
          weight: string
          description: string | null
          image: string | null
          category_id: string | null
          stock: number
          is_new: boolean
          is_bestseller: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          weight: string
          description?: string | null
          image?: string | null
          category_id?: string | null
          stock?: number
          is_new?: boolean
          is_bestseller?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          weight?: string
          description?: string | null
          image?: string | null
          category_id?: string | null
          stock?: number
          is_new?: boolean
          is_bestseller?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          role: 'user' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'user' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'user' | 'admin'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']

export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']

export type CategoryUpdate = Database['public']['Tables']['categories']['Update']
export type ProductUpdate = Database['public']['Tables']['products']['Update']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

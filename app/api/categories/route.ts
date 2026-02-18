import { NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase"

// GET /api/categories
export async function GET() {
  try {
    const supabase = createAdminSupabaseClient()
    
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json(
        { error: "Ошибка при чтении категорий" },
        { status: 500 }
      )
    }
    
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

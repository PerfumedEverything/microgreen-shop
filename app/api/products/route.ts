import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createAdminSupabaseClient } from "@/lib/supabase";
import type { ProductInsert } from "@/types/supabase";

// GET /api/products
export async function GET() {
  try {
    const supabase = createAdminSupabaseClient();

    const { data: products, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories:category_id (name, slug)
      `,
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json(
        { error: "Ошибка при чтении товаров" },
        { status: 500 },
      );
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}

// POST /api/products
export async function POST(request: Request) {
  try {
    // Check authentication
    const supabaseClient = await createServerSupabaseClient();
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Требуется авторизация" },
        { status: 401 },
      );
    }

    // Check if user is admin
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.price || !body.weight) {
      return NextResponse.json(
        { error: "Отсутствуют обязательные поля" },
        { status: 400 },
      );
    }

    const supabase = createAdminSupabaseClient();

    const newProduct: ProductInsert = {
      name: body.name,
      price: body.price,
      weight: body.weight,
      description: body.description || null,
      image: body.image || null,
      category_id: body.category_id || null,
      stock: body.stock || 0,
      is_new: body.is_new || false,
      is_bestseller: body.is_bestseller || false,
      is_active: true,
    };

    const { data, error } = await supabase
      .from("products")
      .insert(newProduct)
      .select(
        `
        *,
        categories:category_id (name, slug)
      `,
      )
      .single();

    if (error) {
      console.error("Error creating product:", error);
      return NextResponse.json(
        { error: "Ошибка при создании товара" },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}

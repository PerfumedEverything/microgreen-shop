import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createAdminSupabaseClient } from "@/lib/supabase";
import type { ProductUpdate } from "@/types/supabase";

// Helper function to check admin access
async function checkAdminAccess() {
  const supabaseClient = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (!session) {
    return { authorized: false, error: "Требуется авторизация", status: 401 };
  }

  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (profile?.role !== "admin") {
    return { authorized: false, error: "Недостаточно прав", status: 403 };
  }

  return { authorized: true, userId: session.user.id };
}

// GET /api/products/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = createAdminSupabaseClient();

    const { data: product, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories:category_id (name, slug)
      `,
      )
      .eq("id", id)
      .single();

    if (error || !product) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}

// PUT /api/products/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check admin access
    const authCheck = await checkAdminAccess();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.status },
      );
    }

    const { id } = await params;
    const body = await request.json();

    const supabase = createAdminSupabaseClient();

    // Check if product exists
    const { data: existingProduct } = await supabase
      .from("products")
      .select("id")
      .eq("id", id)
      .single();

    if (!existingProduct) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }

    const updateData: ProductUpdate = {
      ...(body.name && { name: body.name }),
      ...(body.price !== undefined && { price: body.price }),
      ...(body.weight && { weight: body.weight }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.image !== undefined && { image: body.image }),
      ...(body.category_id !== undefined && { category_id: body.category_id }),
      ...(body.stock !== undefined && { stock: body.stock }),
      ...(body.is_new !== undefined && { is_new: body.is_new }),
      ...(body.is_bestseller !== undefined && {
        is_bestseller: body.is_bestseller,
      }),
      ...(body.is_active !== undefined && { is_active: body.is_active }),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select(
        `
        *,
        categories:category_id (name, slug)
      `,
      )
      .single();

    if (error) {
      console.error("Error updating product:", error);
      return NextResponse.json(
        { error: "Ошибка при обновлении товара" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check admin access
    const authCheck = await checkAdminAccess();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.status },
      );
    }

    const { id } = await params;
    const supabase = createAdminSupabaseClient();

    // Check if product exists
    const { data: existingProduct } = await supabase
      .from("products")
      .select("id")
      .eq("id", id)
      .single();

    if (!existingProduct) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }

    // Soft delete - set is_active to false instead of hard delete
    const { error } = await supabase
      .from("products")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      return NextResponse.json(
        { error: "Ошибка при удалении товара" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, message: "Товар удален" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}

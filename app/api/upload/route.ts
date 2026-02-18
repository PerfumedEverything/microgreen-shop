import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createAdminSupabaseClient } from "@/lib/supabase";

// POST /api/upload - Upload image to Supabase Storage
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

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Файл не найден" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Неподдерживаемый формат файла. Разрешены: JPEG, PNG, WebP, GIF",
        },
        { status: 400 },
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Файл слишком большой. Максимальный размер: 5MB" },
        { status: 400 },
      );
    }

    const supabase = createAdminSupabaseClient();

    // Generate unique filename
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `${timestamp}-${randomString}.${fileExt}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json(
        { error: "Ошибка при загрузке файла" },
        { status: 500 },
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: fileName,
      size: file.size,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}

// DELETE /api/upload - Delete image from Supabase Storage
export async function DELETE(request: Request) {
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

    // Get filename from query params
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json(
        { error: "Имя файла не указано" },
        { status: 400 },
      );
    }

    const supabase = createAdminSupabaseClient();

    // Delete file from Supabase Storage
    const { error } = await supabase.storage
      .from("product-images")
      .remove([filename]);

    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json(
        { error: "Ошибка при удалении файла" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Файл удален",
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}

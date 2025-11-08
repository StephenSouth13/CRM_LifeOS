// File: app/api/reset-fix/route.ts

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase"; // Đảm bảo bạn đang import client ADMIN

/**
 * GET /api/reset-fix
 * Chức năng: Buộc reset mật khẩu cho tài khoản Admin
 * CHỈ CHẠY MỘT LẦN VÀ XÓA SAU KHI THÀNH CÔNG
 */
export async function GET() {
  // Thay thế bằng email Admin của bạn
  const USER_TO_FIX = "stephensouth1307@gmail.com"; 
  // Mật khẩu mới DỄ NHỚ của bạn, ví dụ:
  const NEW_PASSWORD = "PasswordFix2025!"; 
  
  try {
    // 1. Tìm UID của người dùng
    const { data: userData } = await supabaseAdmin.from("auth.users").select("id").eq("email", USER_TO_FIX).single();
    
    if (!userData) {
      return NextResponse.json({ error: "User not found or database error." }, { status: 404 });
    }

    const userId = userData.id;

    // 2. Gọi hàm Admin SDK để cập nhật mật khẩu (Đảm bảo hash hợp lệ)
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, { 
      password: NEW_PASSWORD,
      // Đảm bảo email đã được xác nhận (khắc phục lỗi cũ)
      email_confirm: true 
    });

    if (updateError) {
      console.error("Supabase Admin Update Error:", updateError.message);
      return NextResponse.json({ error: `Update failed: ${updateError.message}` }, { status: 500 });
    }

    // 3. Phản hồi thành công
    return NextResponse.json({
      message: `Password for ${USER_TO_FIX} successfully reset to "${NEW_PASSWORD}" via Admin SDK.`,
      status: "SUCCESS",
    });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error during fix." }, { status: 500 });
  }
}
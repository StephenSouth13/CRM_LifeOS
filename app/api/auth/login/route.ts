// File: app/api/auth/login/route.ts
// Chức năng: Xử lý đăng nhập, xác thực qua Supabase, kiểm tra trạng thái phê duyệt (Manual Vetting) và Role.

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase"; // Client Admin (sử dụng Service Role Key)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. KIỂM TRA INPUT BẮT BUỘC
    if (!email || !password) {
      // Trả về lỗi 400 nếu thiếu trường
      return NextResponse.json(
        { error: "Email and password required." },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      // Kiểm tra cấu hình Serverless (Service Role Key)
      console.error("supabaseAdmin not configured on server");
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 },
      );
    }

    // 2. XÁC THỰC BẰNG SUPABASE AUTH
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      // Trả về 401 nếu email/mật khẩu không khớp
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    // 3. LẤY PROFILE, MEMBERSHIP VÀ ROLE KEY (JOIN 3 Bảng)
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .select(
        `
          *,
          memberships (
            *,
            roles (role_key, role_name) // Join để lấy role_key và role_name
          )
        `,
      )
      .eq("id", authData.user.id)
      .single();

    if (profileError || !userProfile) {
      // Trả về 404 nếu hồ sơ hoặc Membership chưa được tạo (Lỗi DB)
      return NextResponse.json(
        { error: "User profile or membership data not found." },
        { status: 404 },
      );
    }

    // Lấy Primary Membership và Role Key một cách AN TOÀN (FIX UNDEFINED ERROR)
    const primaryMembership: any = userProfile.memberships?.[0]; 
    const safeMembership = primaryMembership || {}; // FIX: Tạo đối tượng an toàn nếu membership rỗng

    const roleKey = safeMembership?.roles?.role_key || "pending_approval";
    const accountStatus = userProfile.account_status;

    // 4. KIỂM TRA TRẠNG THÁI PHÊ DUYỆT BẮT BUỘC (Manual Vetting Workflow)
    if (accountStatus !== "APPROVED") {
        // Nếu trạng thái là PENDING, chặn đăng nhập và trả về 401/403
        return NextResponse.json(
            { 
                error: "Your account is not approved yet. Please wait for administrator approval.",
                status: accountStatus // Trả về trạng thái PENDING/REJECTED
            },
            { status: 401 } // Dùng 401 để ngăn chặn phiên Auth
        );
    }

    // 5. TRẢ VỀ DỮ LIỆU USER HOÀN CHỈNH (Nếu APPROVED)
    return NextResponse.json({
      user: {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        // Dữ liệu Role THẬT TẾ (RBAC)
        role_key: roleKey, 
        manager_id: userProfile.manager_id,
        // FIX: Truy cập an toàn, trả về null nếu membership không có org_id
        org_id: safeMembership.org_id || null, 
        account_status: accountStatus,
        // Bổ sung các trường cần thiết khác cho Frontend
        is_authenticated: true
      },
      session: authData.session,
    });
  } catch (error) {
    console.error("Login fatal error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
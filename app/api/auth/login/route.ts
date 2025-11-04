// File: app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase"; // Cần supabaseAdmin (Service Role Key)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Kiểm tra Dữ liệu Bắt buộc
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required." },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      console.error("supabaseAdmin not configured on server");
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 },
      );
    }

    // 2. Xác thực bằng Supabase Auth
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    // 3. Lấy Profile, Membership và Role Key (JOIN 3 Bảng)
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .select(
        `
          *,
          memberships (
            *,
            roles (role_key, role_name)
          )
        `,
      )
      .eq("id", authData.user.id)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: "User profile or membership data not found." },
        { status: 404 },
      );
    }

    // Lấy Primary Membership và Role Key
    const primaryMembership: any = userProfile.memberships?.[0]; // Giả định lấy membership đầu tiên
    const roleKey = primaryMembership?.roles?.role_key || "pending_approval";
    const accountStatus = userProfile.account_status;

    // 4. KIỂM TRA TRẠNG THÁI PHÊ DUYỆT BẮT BUỘC (Manual Vetting Workflow)
    if (accountStatus !== "APPROVED") {
        // Trả về 403 Forbidden hoặc 401 Unauthorized và thông báo lý do
        return NextResponse.json(
            { 
                error: "Your account is not approved yet.",
                status: accountStatus // Trả về trạng thái PENDING/REJECTED
            },
            { status: 401 }
        );
    }

    // 5. Trả về Dữ liệu User Hoàn chỉnh
    return NextResponse.json({
      user: {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        // Dữ liệu Role THẬT TẾ (RBAC)
        role_key: roleKey, 
        manager_id: userProfile.manager_id,
        org_id: primaryMembership.org_id,
        account_status: accountStatus,
        // ... thêm các trường khác nếu cần
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
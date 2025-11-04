// File: D:\CRM\CRM_LifeOS\app\api\users\route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase"; // Khóa Admin
import { getUserRoleKey } from "@/lib/permissions"; // Giả định bạn có hàm lấy role key

/**
 * GET /api/users - Get list of users (Dùng cho Admin/Leader Dashboard)
 */
export async function GET(request: NextRequest) {
  try {
    // 1. LẤY USER ID CỦA NGƯỜI GỌI (Người đang truy vấn)
    const callingUserId = request.nextUrl.searchParams.get("calling_user_id"); // ID người gọi
    const org_id = request.nextUrl.searchParams.get("org_id");
    const team_id = request.nextUrl.searchParams.get("team_id");

    if (!callingUserId || !org_id) {
      return NextResponse.json({ error: "Calling User ID and org_id are required" }, { status: 400 });
    }

    // 2. KIỂM TRA QUYỀN HẠN (RBAC Server-Side)
    const roleKey = await getUserRoleKey(callingUserId);
    
    // Chỉ Admin, BOD và Leader mới có quyền xem danh sách users
    if (roleKey !== 'admin' && roleKey !== 'bod' && roleKey !== 'leader') {
      return NextResponse.json({ error: "Access denied. Insufficient role." }, { status: 403 });
    }

    // 3. XÂY DỰNG QUERY LỌC DỮ LIỆU
    let query = supabaseAdmin
      .from("user_profiles")
      .select("*, memberships(role_id, roles(role_key, role_name))") // Bổ sung join roles
      .eq("org_id", org_id);

    // Lọc theo LEADER SCOPE (Leader chỉ xem Team trực thuộc)
    if (roleKey === 'leader' && !team_id) {
      // Nếu là Leader và không lọc theo Team ID cụ thể, chỉ hiển thị Team mình quản lý
      query = query.eq("manager_id", callingUserId);
    } else if (team_id) {
      query = query.eq("team_id", team_id);
    }
    
    // Admin/BOD xem toàn bộ

    const { data: users, error } = await query;

    if (error) {
      console.error("Get users DB error:", error.message);
      return NextResponse.json({ error: "Database error fetching users." }, { status: 500 });
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Get users API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/users - Update user profile
 * (Dùng cho người dùng cập nhật hồ sơ của chính họ hoặc Admin cập nhật hồ sơ người khác)
 */
export async function PUT(request: NextRequest) {
  try {
    // Lấy userId từ URL (Giả định path là /api/users/:id hoặc gửi trong body)
    const body = await request.json();
    const { userId, name, avatar, team_id, manager_id, calling_user_id } = body; 

    if (!userId || !calling_user_id) {
      return NextResponse.json({ error: "User ID and Calling User ID are required" }, { status: 400 });
    }

    // 1. KIỂM TRA QUYỀN (Chỉ có thể sửa hồ sơ của mình HOẶC là Admin/BOD/Manager)
    if (userId !== calling_user_id) {
        const callingRole = await getUserRoleKey(calling_user_id);
        if (callingRole !== 'admin' && callingRole !== 'bod' && callingRole !== 'leader') {
            return NextResponse.json({ error: "Permission denied to update other user's profile." }, { status: 403 });
        }
    }

    const updates: Record<string, any> = {};
    if (name) updates.name = name;
    if (avatar) updates.avatar = avatar;
    if (team_id) updates.team_id = team_id;
    if (manager_id) updates.manager_id = manager_id;
    updates.updated_at = new Date().toISOString();

    const { data: user, error } = await supabaseAdmin
      .from("user_profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Update profile DB error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user, message: "Profile updated successfully." });
  } catch (error) {
    console.error("Update user API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
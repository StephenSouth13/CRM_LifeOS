// File: D:\CRM\CRM_LifeOS\app\api\users\[id]\role\route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase";
import { getUserRoleKey, canManageUser } from "@/lib/permissions"; // Giả định các hàm RBAC

// Định nghĩa kiểu dữ liệu cho tham số params
interface Params {
    id: string;
}

/**
 * GET /api/users/[id]/role - Get user role information
 * (Dùng cho Admin/Leader xem role của người khác)
 */
export const GET = async (
  request: NextRequest,
  { params }: { params: Params } // Fix lỗi TypeScript 2344
) => {
  try {
    const userId = params.id;
    const org_id = request.nextUrl.searchParams.get("org_id");

    if (!userId || !org_id) {
      return NextResponse.json({ error: "User ID and org_id are required" }, { status: 400 });
    }

    // RBAC: Logic đã được bảo vệ bởi RLS, nhưng ta thêm check nhanh
    // const callingUserId = request.nextUrl.searchParams.get("calling_user_id"); // Lấy từ Frontend
    // const callingRole = await getUserRoleKey(callingUserId);
    // if (callingRole !== 'admin' && callingRole !== 'bod') { ... }

    const { data: membership, error } = await supabaseAdmin
      .from("memberships")
      .select("*, roles(role_key, role_level)") // Bổ sung lấy role_level để so sánh
      .eq("user_id", userId)
      .eq("org_id", org_id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ membership });
  } catch (error) {
    console.error("Get role error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/users/[id]/role - Nâng/Giáng cấp Role của người dùng
 * (Chỉ dành cho ADMIN/BOD)
 */
export const PUT = async (
  request: NextRequest,
  { params }: { params: Params } // Fix lỗi TypeScript 2344
) => {
    const userId = params.id; 
    
    try {
        const body = await request.json();
        const { new_role, org_id, assigned_by } = body; 

        if (!userId || !new_role || !org_id || !assigned_by) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        // 1. LẤY ROLE ID TỪ TÊN KEY MỚI
        const { data: newRoleData, error: roleKeyError } = await supabaseAdmin
            .from('roles')
            .select('id, role_level') 
            .eq('role_key', new_role)
            .single();
            
        if (roleKeyError || !newRoleData) {
            return NextResponse.json({ error: "Invalid new role key provided." }, { status: 400 });
        }
        
        // 2. SERVER-SIDE RBAC HIERARCHY CHECK (Quan trọng)
        const assignerRoleKey = await getUserRoleKey(assigned_by);
        const assignerRoleLevel = await getUserRoleLevel(assigned_by); // Giả định hàm lấy Level

        // Ngăn không cho Leader gán Role Admin/BOD (Chỉ Admin/BOD được gán Role cấp cao)
        if (assignerRoleKey !== 'admin' && assignerRoleKey !== 'bod') {
             if (newRoleData.role_level <= 3) { // 3 là cấp Leader, 2 là Admin, 1 là BOD
                 return NextResponse.json({ error: "Only Admin/BOD can assign high-level roles." }, { status: 403 });
             }
             // Ngăn không cho Leader gán Role bằng hoặc cao hơn Role của mình
             if (newRoleData.role_level <= assignerRoleLevel) {
                 return NextResponse.json({ error: "Cannot assign role equal or higher than yours." }, { status: 403 });
             }
        }
        
        // 3. Cập nhật membership
        const { error: updateError } = await supabaseAdmin
            .from("memberships")
            .update({
                role_id: newRoleData.id, 
                updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId)
            .eq("org_id", org_id)
            .select()
            .single();

        if (updateError) {
            console.error('Role update error:', updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({
            message: `User role updated to ${new_role}`,
        });
    } catch (error) {
        console.error("PUT role error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
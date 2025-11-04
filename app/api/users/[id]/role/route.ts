import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase";
import { canManageUser } from "@/lib/permissions";
import type { Role } from "@/lib/types";

// Định nghĩa kiểu dữ liệu cho tham số params
// Khai báo kiểu này ở đầu file là cần thiết
interface Params {
    id: string;
}

// ----------------------------------------------------
// GET /api/users/[id]/role - Get user role information
// ----------------------------------------------------
// Dùng cú pháp hàm không cần khai báo kiểu chi tiết trong context để tránh lỗi
export const GET = async (
  request: NextRequest,
  context: { params: Params } // Sử dụng kiểu đã định nghĩa
) => {
  try {
    const userId = context.params.id; // Truy cập userId
    const org_id = request.nextUrl.searchParams.get("org_id");

    if (!userId || !org_id) {
      return NextResponse.json({ error: "User ID and org_id are required" }, { status: 400 });
    }

    const { data: membership, error } = await supabaseAdmin
      .from("memberships")
      .select("*, roles(role_key)") 
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

// ----------------------------------------------------
// PUT /api/users/[id]/role - Update user role (Nâng/Giáng cấp)
// ----------------------------------------------------
export const PUT = async (
  request: NextRequest,
  context: { params: Params } // Sử dụng kiểu đã định nghĩa
) => {
    const userId = context.params.id; 
    
    try {
        const body = await request.json();
        const { new_role, org_id, assigned_by } = body; 

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        if (!new_role || !org_id || !assigned_by) {
            return NextResponse.json(
                { error: "new_role, org_id, and assigned_by are required" },
                { status: 400 }
            );
        }
        
        // LẤY ROLE ID TỪ TÊN KEY MỚI
        const { data: newRoleData, error: roleKeyError } = await supabaseAdmin
            .from('roles')
            .select('id')
            .eq('role_key', new_role)
            .single();
            
        if (roleKeyError || !newRoleData) {
            return NextResponse.json({ error: "Invalid new role key provided." }, { status: 400 });
        }
        
        // LẤY ROLE ID MỚI ĐÃ SỬA TỪ BẢNG ROLES
        const newRoleId = newRoleData.id; 

        // Update membership
        const { data: updatedMembership, error } = await supabaseAdmin
            .from("memberships")
            .update({
                role_id: newRoleId, 
                updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId)
            .eq("org_id", org_id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            membership: updatedMembership,
            message: `User role updated to ${new_role}`,
        });
    } catch (error) {
        console.error("Update role error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
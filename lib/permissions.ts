// File: lib/permissions.ts (FINAL MERGED & FIXED VERSION)

import { supabaseAdmin } from "@/lib/supabase/supabase"; // BẮT BUỘC: Cho các hàm DB
import type { Role as RoleType, Permission as PermissionType } from "./types";

export type Role = "BOD" | "ADMIN" | "LEADER" | "MENTOR" | "STUDENT_L3" | "STUDENT_L2" | "STUDENT_L1" | "EMPLOYEE" | "COLLABORATOR" | "CUSTOMER" | "PENDING_APPROVAL";
export type Permission = string; 

// ----------------------------------------------------------------------
// 1. ROLE HIERARCHY
// ----------------------------------------------------------------------

export const ROLE_HIERARCHY: Record<Role, number> = {
    BOD: 11, ADMIN: 10, LEADER: 9, STUDENT_L3: 8, MENTOR: 7, 
    STUDENT_L2: 6, EMPLOYEE: 5, COLLABORATOR: 5, STUDENT_L1: 4, 
    CUSTOMER: 3, PENDING_APPROVAL: 1, 
};

// ----------------------------------------------------------------------
// 2. ROLE PERMISSIONS MATRIX (ĐÃ BỔ SUNG ĐẦY ĐỦ 11 ROLES)
// ----------------------------------------------------------------------

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    // 1. BOD (Ban Điều Hành)
    BOD: [
        "dashboard.view", "dashboard.admin_view", "org.view", "user.view_all", 
        "user.role_manage", "attendance.view_all", "attendance.verify", 
        "evaluation.view_all", "evaluation.approve_all", "salary.view_all", 
        "salary.manage", "leave.approve_all", "report.view_all", "calendar.manage_all",
        "ai.use", "room.manage"
    ],

    // 2. ADMIN (Quản trị Hệ thống)
    ADMIN: [
        "dashboard.view", "dashboard.admin_view", "admin.manage", "org.manage", 
        "user.view_all", "user.role_manage", "user.update_all", "user.create",
        "attendance.view_all", "attendance.create", "attendance.update_all", 
        "attendance.verify", "evaluation.view_all", "evaluation.create_all", 
        "evaluation.approve_all", "salary.view_all", "salary.manage", 
        "task.view_all", "task.create", "task.update_all", "task.delete_all", 
        "leave.view_all", "leave.create", "leave.approve_all", "report.view_all", 
        "calendar.manage_all", "ai.use", "room.manage"
    ],

    // 3. LEADER (Trưởng nhóm/Dự án)
    LEADER: [
        "dashboard.view", "user.view_team", "user.view_self", "user.update_team",
        "attendance.view_team", "attendance.view_self", "attendance.create",
        "attendance.verify", "evaluation.view_team", "evaluation.create_team", 
        "leave.view_team", "leave.view_self", "leave.create", "leave.approve_team",
        "task.view_team", "task.view_self", "task.create", "task.assign_team", 
        "task.update_team", "salary.view_self", "report.view_team", "calendar.manage_team", "ai.use"
    ],

    // 4. MENTOR (Đánh giá Chuyên môn)
    MENTOR: [
        "dashboard.view", "user.view_self", "user.update_self", 
        "attendance.view_self", "attendance.create", 
        "task.view_self", "task.update_self", 
        "evaluation.view_self", "evaluation.create_team", // Create for Assigned
        "leave.view_self", "leave.create", "salary.view_self", "ai.use", "calendar.view"
    ],

    // 5. STUDENT_L3 (Hỗ trợ Lãnh đạo)
    STUDENT_L3: [
        "dashboard.view", "user.view_self", "user.view_team", 
        "attendance.view_self", "attendance.create", "attendance.update_self",
        "task.view_team", "task.view_self", "task.create", "task.update_team",
        "evaluation.view_self", "evaluation.create_team", // Create for L1/CTV
        "leave.view_self", "leave.create", "salary.view_self", "calendar.view", "ai.use"
    ],

    // 6. STUDENT_L2 (Thực hiện Công việc)
    STUDENT_L2: [
        "dashboard.view", "user.view_self", "user.update_self", 
        "attendance.view_self", "attendance.create", "attendance.update_self",
        "task.view_self", "task.create", "task.update_self", 
        "evaluation.view_self", 
        "leave.view_self", "leave.create", "salary.view_self", "calendar.view", "ai.use"
    ],
    
    // 7. EMPLOYEE (Nhân sự chính thức - Giống L2)
    EMPLOYEE: [
        "dashboard.view", "user.view_self", "user.update_self", 
        "attendance.view_self", "attendance.create", "attendance.update_self",
        "task.view_self", "task.create", "task.update_self", 
        "evaluation.view_self", 
        "leave.view_self", "leave.create", "salary.view_self", "calendar.view", "ai.use"
    ],

    // 8. COLLABORATOR (Cộng tác viên)
    COLLABORATOR: [
        "dashboard.view", "user.view_self", 
        "attendance.view_self", "attendance.create", "attendance.update_self",
        "task.view_self", "task.update_self", 
        "leave.view_self", "leave.create", "calendar.view", "ai.use"
    ],

    // 9. STUDENT_L1 (Cơ bản)
    STUDENT_L1: [
        "dashboard.view", "user.view_self", "attendance.view_self", "attendance.create", 
        "task.view_self", "evaluation.view_self", "leave.view_self", "leave.create", "calendar.view"
    ],

    // 10. CUSTOMER (Chỉ xem)
    CUSTOMER: [
        "dashboard.view", "user.view_self", "report.view_self", "calendar.view"
    ],

    // 11. PENDING_APPROVAL (Bị chặn)
    PENDING_APPROVAL: []
};

// ----------------------------------------------------------------------
// 3. CÁC HÀM TRUY VẤN DB (FIX LỖI 2305 & 2552)
// ----------------------------------------------------------------------

/**
 * Lấy Role Key từ Database
 */
export async function getUserRoleKey(userId: string): Promise<Role | null> {
    if (!userId) return null;
    const { data } = await supabaseAdmin.from("memberships").select("roles(role_key)").eq("user_id", userId).limit(1).maybeSingle();
    // @ts-ignore
    return data?.roles?.role_key as Role || null;
}

/**
 * Lấy Role Level (Số) từ Database
 */
export async function getUserRoleLevel(userId: string): Promise<number> {
    if (!userId) return 1;
    const { data } = await supabaseAdmin.from("memberships").select("roles(role_level)").eq("user_id", userId).limit(1).maybeSingle();
    // @ts-ignore
    return data?.roles?.role_level || 1;
}

// ----------------------------------------------------------------------
// 4. CÁC HÀM LOGIC CƠ BẢN (KHẮC PHỤC LỖI THIẾU EXPORT)
// ----------------------------------------------------------------------

export function hasPermission(role: Role, permission: Permission): boolean {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function canManageUser(userRole: Role, targetRole: Role): boolean {
    return ROLE_HIERARCHY[userRole] > ROLE_HIERARCHY[targetRole];
}

export function canAccess(
  role: Role,
  permission: Permission,
  scope: "all" | "team" | "self" = "self",
): boolean {
  const scopedPermission = `${permission.split(".")[0]}.${permission.split(".")[1]}_${scope}`
  return hasPermission(role, scopedPermission as Permission)
}

// ... (Bạn có thể bổ sung các hàm UI khác: getRoleLabel, getRoleColor, v.v. ở đây) ...
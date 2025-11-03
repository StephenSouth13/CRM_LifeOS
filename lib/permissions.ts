import type { Role, Permission } from "./types"

// RBAC Permission Matrix - Each role has specific permissions
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  // 1. BOD (Ban Điều Hành) - Full Read + Full Salaries + Approval Power
  BOD: [
    // Dashboard
    "dashboard.view",
    "dashboard.admin_view",

    // Organization & Users - View Only
    "org.view",
    "user.view_all",
    "user.view_team",
    "user.view_self",
    "user.role_manage",

    // Attendance - View All + Verify
    "attendance.view_all",
    "attendance.view_team",
    "attendance.view_self",
    "attendance.verify",
    "attendance.approve_leaves",

    // Tasks - View All Only
    "task.view_all",
    "task.view_team",
    "task.view_self",

    // Evaluations - Approve All + View All
    "evaluation.view_all",
    "evaluation.view_team",
    "evaluation.view_self",
    "evaluation.approve_all",

    // Billing & Salaries - Full CRUD
    "billing.view",
    "billing.manage",
    "salary.view_all",
    "salary.manage",

    // Calendar
    "calendar.view",
    "calendar.manage_all",
    "room.view",
    "room.manage",

    // Leave - Approve All
    "leave.view_all",
    "leave.view_team",
    "leave.view_self",
    "leave.approve_all",

    // Reports
    "report.view_all",
  ],

  // 2. ADMIN (Quản trị Hệ thống) - Full System Management
  ADMIN: [
    // Dashboard
    "dashboard.view",
    "dashboard.admin_view",

    // Admin
    "admin.manage",

    // Organization & Users - Full Management
    "org.view",
    "org.manage",
    "user.view_all",
    "user.create",
    "user.update_all",
    "user.suspend",
    "user.role_manage",
    "user.role_promote",
    "user.role_demote",

    // Attendance - Full Management
    "attendance.view_all",
    "attendance.create",
    "attendance.update_all",
    "attendance.verify",
    "attendance.approve_leaves",

    // Tasks - Full Management
    "task.view_all",
    "task.create",
    "task.assign_all",
    "task.update_all",
    "task.delete_all",

    // Evaluations - View All + Create
    "evaluation.view_all",
    "evaluation.create_all",
    "evaluation.approve_all",

    // Billing & Salaries - Full Management
    "billing.view",
    "billing.manage",
    "salary.view_all",
    "salary.manage",

    // Calendar & Rooms
    "calendar.view",
    "calendar.create",
    "calendar.manage_all",
    "room.view",
    "room.book",
    "room.manage",

    // Leave - Approve All
    "leave.view_all",
    "leave.create",
    "leave.approve_all",

    // AI Tools
    "ai.view",
    "ai.use",

    // Reports
    "report.view_all",
  ],

  // 3. LEADER (Trưởng nhóm/Dự án) - Team Management
  LEADER: [
    // Dashboard
    "dashboard.view",

    // Users - Team Management Only
    "user.view_team",
    "user.view_self",
    "user.update_team",

    // Attendance - Team Management
    "attendance.view_team",
    "attendance.view_self",
    "attendance.update_team",
    "attendance.verify",
    "attendance.approve_leaves",

    // Tasks - Team Management
    "task.view_team",
    "task.view_self",
    "task.create",
    "task.assign_team",
    "task.update_team",

    // Evaluations - Team Evaluation + Approval
    "evaluation.view_team",
    "evaluation.view_self",
    "evaluation.create_team",
    "evaluation.approve_team",

    // Salary - Team View Only
    "salary.view_team",
    "salary.view_self",

    // Calendar - Team Management
    "calendar.view",
    "calendar.create",
    "calendar.manage_team",
    "room.view",
    "room.book",

    // Leave - Team Approval
    "leave.view_team",
    "leave.view_self",
    "leave.create",
    "leave.approve_team",

    // AI Tools
    "ai.view",
    "ai.use",

    // Reports
    "report.view_team",
    "report.view_self",
  ],

  // 4. MENTOR (Đánh giá Chuyên môn) - Evaluation Only
  MENTOR: [
    // Dashboard
    "dashboard.view",

    // Users - View Self Only
    "user.view_self",
    "user.update_self",

    // Attendance - View Self Only
    "attendance.view_self",
    "attendance.create",
    "attendance.update_self",

    // Tasks - View Self
    "task.view_self",
    "task.create",
    "task.update_self",

    // Evaluations - Create Only for Assigned Students
    "evaluation.view_self",
    "evaluation.create_team",

    // Salary - View Self Only
    "salary.view_self",

    // Calendar
    "calendar.view",
    "calendar.create",
    "room.view",
    "room.book",

    // Leave - Create Own Leaves
    "leave.view_self",
    "leave.create",

    // AI Tools
    "ai.view",
    "ai.use",

    // Reports
    "report.view_self",
  ],

  // 5. STUDENT_L3 (Thực chiến & Hỗ trợ Lãnh đạo) - Leadership Support
  STUDENT_L3: [
    // Dashboard
    "dashboard.view",

    // Users - View Self + View Team
    "user.view_team",
    "user.view_self",

    // Attendance - View Self + Create + Update Self
    "attendance.view_self",
    "attendance.create",
    "attendance.update_self",

    // Tasks - Full Task Management for Team
    "task.view_team",
    "task.view_self",
    "task.create",
    "task.assign_team",
    "task.update_team",

    // Evaluations - View Self + Create for L1/CTV
    "evaluation.view_self",
    "evaluation.create_team",

    // Salary - View Self Only
    "salary.view_self",

    // Calendar
    "calendar.view",
    "calendar.create",
    "calendar.manage_team",
    "room.view",
    "room.book",

    // Leave
    "leave.view_self",
    "leave.create",

    // AI Tools
    "ai.view",
    "ai.use",

    // Reports
    "report.view_self",
  ],

  // 6. STUDENT_L2 (Thực hiện Công việc) - Task Execution
  STUDENT_L2: [
    // Dashboard
    "dashboard.view",

    // Users - View Self Only
    "user.view_self",
    "user.update_self",

    // Attendance - View Self + Create + Update Self
    "attendance.view_self",
    "attendance.create",
    "attendance.update_self",

    // Tasks - View Assigned + Update Self
    "task.view_self",
    "task.create",
    "task.update_self",

    // Evaluations - View Self Only
    "evaluation.view_self",

    // Salary - View Self Only
    "salary.view_self",

    // Calendar
    "calendar.view",
    "calendar.create",
    "room.view",
    "room.book",

    // Leave - Create Own Leaves
    "leave.view_self",
    "leave.create",

    // AI Tools
    "ai.view",
    "ai.use",

    // Reports
    "report.view_self",
  ],

  // 7. STUDENT_L1 / CTV (Cơ bản/Làm quen) - Minimal Permissions
  STUDENT_L1: [
    // Dashboard
    "dashboard.view",

    // Users - View Self Only
    "user.view_self",

    // Attendance - View Self + Create + Update Self
    "attendance.view_self",
    "attendance.create",
    "attendance.update_self",

    // Tasks - View Self Only
    "task.view_self",

    // Evaluations - View Self Only
    "evaluation.view_self",

    // Salary - View Self Only
    "salary.view_self",

    // Calendar
    "calendar.view",
    "room.view",

    // Leave - Create Own Leaves
    "leave.view_self",
    "leave.create",

    // AI Tools
    "ai.view",
    "ai.use",

    // Reports
    "report.view_self",
  ],

  // 8. CUSTOMER / STAKEHOLDER - Minimal Read-Only
  CUSTOMER: [
    // Dashboard
    "dashboard.view",

    // Users - View Self Only
    "user.view_self",

    // Calendar - Read Only
    "calendar.view",
    "room.view",

    // Reports - View Self/Public Only
    "report.view_self",
  ],
}

// Role Hierarchy for Permission Checks
export const ROLE_HIERARCHY: Record<Role, number> = {
  BOD: 8,
  ADMIN: 7,
  LEADER: 6,
  MENTOR: 5,
  STUDENT_L3: 4,
  STUDENT_L2: 3,
  STUDENT_L1: 2,
  CUSTOMER: 1,
}

/**
 * Check if a user has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

/**
 * Check if user can manage another user based on role hierarchy
 */
export function canManageUser(userRole: Role, targetRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] > ROLE_HIERARCHY[targetRole]
}

/**
 * Check if user can perform action on scope (all, team, self)
 */
export function canAccess(
  role: Role,
  permission: Permission,
  scope: "all" | "team" | "self" = "self",
): boolean {
  const scopedPermission = `${permission.split(".")[0]}.${permission.split(".")[1]}_${scope}`
  return hasPermission(role, scopedPermission as Permission)
}

/**
 * Get human-readable role label
 */
export function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    BOD: "Ban Điều Hành",
    ADMIN: "Quản trị viên",
    LEADER: "Trưởng nhóm",
    MENTOR: "Cố vấn/Huấn luyện viên",
    STUDENT_L3: "Học viên L3",
    STUDENT_L2: "Học viên L2",
    STUDENT_L1: "Học viên L1",
    CUSTOMER: "Khách hàng",
  }
  return labels[role]
}

/**
 * Get role color for UI display
 */
export function getRoleColor(role: Role): string {
  const colors: Record<Role, string> = {
    BOD: "text-red-600",
    ADMIN: "text-blue-600",
    LEADER: "text-emerald-600",
    MENTOR: "text-amber-600",
    STUDENT_L3: "text-purple-600",
    STUDENT_L2: "text-cyan-600",
    STUDENT_L1: "text-slate-600",
    CUSTOMER: "text-gray-600",
  }
  return colors[role]
}

/**
 * Get role background color for badges
 */
export function getRoleBgColor(role: Role): string {
  const colors: Record<Role, string> = {
    BOD: "bg-red-100 text-red-700",
    ADMIN: "bg-blue-100 text-blue-700",
    LEADER: "bg-emerald-100 text-emerald-700",
    MENTOR: "bg-amber-100 text-amber-700",
    STUDENT_L3: "bg-purple-100 text-purple-700",
    STUDENT_L2: "bg-cyan-100 text-cyan-700",
    STUDENT_L1: "bg-slate-100 text-slate-700",
    CUSTOMER: "bg-gray-100 text-gray-700",
  }
  return colors[role]
}

/**
 * Get all roles that can be managed by a given role
 */
export function getManagedRoles(role: Role): Role[] {
  const userHierarchy = ROLE_HIERARCHY[role]
  return Object.entries(ROLE_HIERARCHY)
    .filter(([_, hierarchy]) => hierarchy < userHierarchy)
    .map(([role]) => role as Role)
}

/**
 * Check if a role can view resources at a specific scope
 */
export function canViewScope(role: Role, permission: string): "all" | "team" | "self" {
  const basePermission = permission.split("_")[0]
  if (hasPermission(role, `${basePermission}_all` as Permission)) return "all"
  if (hasPermission(role, `${basePermission}_team` as Permission)) return "team"
  return "self"
}

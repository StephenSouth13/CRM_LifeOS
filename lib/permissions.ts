import type { Role, Permission } from "./types"

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: [
    "org.manage",
    "billing.manage",
    "user.create",
    "user.update",
    "user.suspend",
    "role.manage",
    "module.toggle",
    "room.manage",
    "attendance.checkin",
    "attendance.verify",
    "payroll.view",
    "task.create",
    "task.assign",
    "task.update.any",
    "notes.create.shared",
    "ai.use",
    "iframe.embed",
    "calendar.manage",
    "leave.approve",
  ],
  admin: [
    "user.create",
    "user.update",
    "user.suspend",
    "role.manage",
    "module.toggle",
    "room.manage",
    "attendance.checkin",
    "attendance.verify",
    "payroll.view",
    "task.create",
    "task.assign",
    "task.update.any",
    "notes.create.shared",
    "ai.use",
    "iframe.embed",
    "calendar.manage",
    "leave.approve",
  ],
  leader: [
    "user.update", // team only
    "room.manage",
    "attendance.checkin",
    "attendance.verify",
    "payroll.view", // team only
    "task.create",
    "task.assign",
    "task.update.any",
    "notes.create.shared",
    "ai.use",
    "iframe.embed",
    "calendar.manage",
    "leave.approve",
  ],
  staff: [
    "attendance.checkin",
    "task.create",
    "task.update.any", // own only
    "notes.create.shared",
    "ai.use",
    "iframe.embed",
  ],
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function canManageUser(userRole: Role, targetRole: Role): boolean {
  const hierarchy: Record<Role, number> = {
    owner: 4,
    admin: 3,
    leader: 2,
    staff: 1,
  }
  return hierarchy[userRole] > hierarchy[targetRole]
}

export function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    owner: "Owner",
    admin: "Admin",
    leader: "Leader",
    staff: "Staff",
  }
  return labels[role]
}

export function getRoleColor(role: Role): string {
  const colors: Record<Role, string> = {
    owner: "text-purple-500",
    admin: "text-blue-500",
    leader: "text-emerald-500",
    staff: "text-gray-500",
  }
  return colors[role]
}

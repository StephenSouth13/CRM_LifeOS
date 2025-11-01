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
    "student.view",
    "student.evaluate",
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
    "student.view",
    "student.evaluate",
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
    "student.view",
    "student.evaluate",
  ],
  staff: [
    "attendance.checkin",
    "task.create",
    "task.update.any", // own only
    "notes.create.shared",
    "ai.use",
    "iframe.embed",
  ],
  student: [
    "attendance.checkin",
    "task.create",
    "notes.create.shared",
    "ai.use",
  ],
  mentor: ["student.view", "student.evaluate", "ai.use"],
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function canManageUser(userRole: Role, targetRole: Role): boolean {
  const hierarchy: Record<Role, number> = {
    owner: 5,
    admin: 4,
    leader: 3,
    staff: 2,
    student: 1,
    mentor: 2, // Mentors can manage students
  }
  return (hierarchy[userRole] ?? 0) > (hierarchy[targetRole] ?? 0)
}

export function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    owner: "Owner",
    admin: "Admin",
    leader: "Leader",
    staff: "Staff",
    student: "Student",
    mentor: "Mentor",
  }
  return labels[role] ?? "Unknown Role"
}

export function getRoleColor(role: Role): string {
  const colors: Record<Role, string> = {
    owner: "text-purple-500",
    admin: "text-blue-500",
    leader: "text-emerald-500",
    staff: "text-gray-500",
    student: "text-green-500",
    mentor: "text-orange-500",
  }
  return colors[role] ?? "text-gray-500"
}

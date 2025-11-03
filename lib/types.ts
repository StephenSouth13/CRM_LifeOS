// Role Hierarchy
export type Role =
  | "BOD"
  | "ADMIN"
  | "LEADER"
  | "MENTOR"
  | "STUDENT_L3"
  | "STUDENT_L2"
  | "STUDENT_L1"
  | "CUSTOMER"

// Comprehensive Permission Set
export type Permission =
  // Dashboard & Admin
  | "dashboard.view"
  | "dashboard.admin_view"
  | "admin.manage"

  // Organization & User Management
  | "org.view"
  | "org.manage"
  | "user.view_all"
  | "user.view_team"
  | "user.view_self"
  | "user.create"
  | "user.update_all"
  | "user.update_team"
  | "user.update_self"
  | "user.suspend"
  | "user.role_manage"
  | "user.role_promote"
  | "user.role_demote"

  // Attendance & Check-in
  | "attendance.view_all"
  | "attendance.view_team"
  | "attendance.view_self"
  | "attendance.create"
  | "attendance.update_all"
  | "attendance.update_team"
  | "attendance.update_self"
  | "attendance.verify"
  | "attendance.approve_leaves"

  // Tasks & Projects
  | "task.view_all"
  | "task.view_team"
  | "task.view_self"
  | "task.create"
  | "task.assign_all"
  | "task.assign_team"
  | "task.update_all"
  | "task.update_team"
  | "task.update_self"
  | "task.delete_all"

  // Evaluations (ASK)
  | "evaluation.view_all"
  | "evaluation.view_team"
  | "evaluation.view_self"
  | "evaluation.create_all"
  | "evaluation.create_team"
  | "evaluation.create_self"
  | "evaluation.approve_all"
  | "evaluation.approve_team"

  // Billing & Salaries
  | "billing.view"
  | "billing.manage"
  | "salary.view_all"
  | "salary.view_team"
  | "salary.view_self"
  | "salary.manage"

  // Calendar & Meetings
  | "calendar.view"
  | "calendar.create"
  | "calendar.manage_all"
  | "calendar.manage_team"
  | "room.view"
  | "room.book"
  | "room.manage"

  // Leave Management
  | "leave.view_all"
  | "leave.view_team"
  | "leave.view_self"
  | "leave.create"
  | "leave.approve_all"
  | "leave.approve_team"

  // AI Tools
  | "ai.view"
  | "ai.use"

  // Reports & Analytics
  | "report.view_all"
  | "report.view_team"
  | "report.view_self"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: Role
  manager_id?: string
  orgId: string
  teamId?: string
  status: "active" | "inactive" | "suspended"
  createdAt: Date
  updatedAt: Date
}

export interface UserRole {
  id: string
  user_id: string
  role: Role
  assigned_by: string
  assigned_at: Date
  is_primary: boolean
}

export interface Organization {
  id: string
  name: string
  description?: string
  logo?: string
  website?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  postal_code?: string
  timezone?: string
  createdAt: Date
  updatedAt: Date
}

export interface Team {
  id: string
  org_id: string
  name: string
  description?: string
  leader_id: string
  department?: string
  createdAt: Date
  updatedAt: Date
}

export interface Membership {
  id: string
  user_id: string
  org_id: string
  team_id?: string
  role: Role
  is_primary: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "in_progress" | "review" | "done" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  assignee_id?: string
  assigned_by: string
  team_id: string
  org_id: string
  due_date?: Date
  completed_date?: Date
  subtasks?: Task[]
  createdAt: Date
  updatedAt: Date
}

export interface AttendanceLog {
  id: string
  user_id: string
  org_id: string
  team_id?: string
  check_in_time: Date
  check_out_time?: Date
  check_in_lat?: number
  check_in_lon?: number
  check_out_lat?: number
  check_out_lon?: number
  check_in_wifi_ssid?: string
  check_out_wifi_ssid?: string
  status: "valid" | "pending" | "invalid" | "late"
  verified_by?: string
  verified_at?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface LeaveRequest {
  id: string
  user_id: string
  org_id: string
  team_id?: string
  type: "sick" | "vacation" | "personal" | "unpaid" | "other"
  start_date: Date
  end_date: Date
  days: number
  reason: string
  status: "pending" | "approved" | "denied" | "cancelled"
  approved_by?: string
  approved_at?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Evaluation {
  id: string
  evaluator_id: string
  evaluatee_id: string
  org_id: string
  team_id?: string
  type: "self" | "peer" | "manager" | "mentor"
  technical_skills?: number
  soft_skills?: number
  knowledge?: number
  attitude?: number
  overall_score?: number
  comments?: string
  is_approved: boolean
  approved_by?: string
  approved_at?: Date
  impact_on_promotion: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Salary {
  id: string
  user_id: string
  org_id: string
  base_salary: number
  bonus?: number
  deductions?: number
  total_salary: number
  currency: string
  payment_method: string
  effective_date: Date
  status: "draft" | "pending_approval" | "approved" | "paid"
  approved_by?: string
  approved_at?: Date
  paid_at?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Room {
  id: string
  org_id: string
  name: string
  capacity: number
  location: string
  floor?: string
  amenities: string[]
  equipment?: string[]
  is_available: boolean
  createdAt: Date
  updatedAt: Date
}

export interface RoomBooking {
  id: string
  room_id: string
  user_id: string
  org_id: string
  title: string
  description?: string
  start_time: Date
  end_time: Date
  attendees: string[]
  status: "pending" | "confirmed" | "cancelled"
  meeting_link?: string
  createdAt: Date
  updatedAt: Date
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start_time: Date
  end_time: Date
  location?: string
  org_id: string
  team_id?: string
  creator_id: string
  attendees: string[]
  type: "meeting" | "task" | "reminder" | "leave" | "event"
  color?: string
  is_all_day: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Note {
  id: string
  title: string
  content: string
  author_id: string
  org_id: string
  team_id?: string
  visibility: "private" | "team" | "org"
  pinned: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface MediaPlayerState {
  userId: string
  orgId: string
  sessionId: string
  currentMedia?: {
    type: "spotify" | "youtube" | "local"
    id: string
    title: string
    url: string
  }
  position: number
  playing: boolean
  volume: number
  playlist: Array<{
    type: string
    id: string
    title: string
    url: string
  }>
}

export interface Section {
  id: string
  type: "widget" | "iframe" | "notes" | "calendar" | "tasks"
  title: string
  order: number
  visible: boolean
  props?: Record<string, any>
}

export interface WorkflowNode {
  id: string
  type: "trigger" | "action" | "ai" | "condition"
  label: string
  config: Record<string, any>
  position: { x: number; y: number }
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  label?: string
}

export interface Workflow {
  id: string
  name: string
  description?: string
  org_id: string
  creator_id: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  enabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface WorkflowRun {
  id: string
  workflow_id: string
  status: "running" | "success" | "failed"
  started_at: Date
  completed_at?: Date
  logs: Array<{
    timestamp: Date
    level: "info" | "warning" | "error"
    message: string
  }>
}

export interface Module {
  id: string
  name: string
  type:
    | "dashboard"
    | "attendance"
    | "tasks"
    | "calendar"
    | "organizations"
    | "billing"
    | "evaluations"
    | "ai"
    | "reports"
  icon: string
  enabled: boolean
  permissions: Permission[]
  config?: Record<string, any>
}

export interface AITool {
  id: string
  name: string
  type: "summarize" | "generate" | "image" | "plan" | "chat"
  description: string
  icon: string
  permissions: Permission[]
}

export interface AISession {
  id: string
  user_id: string
  tool_id: string
  messages: Array<{
    role: "user" | "assistant" | "system"
    content: string
    timestamp: Date
  }>
  result?: any
  createdAt: Date
}

export interface AuditLog {
  id: string
  user_id: string
  org_id: string
  action: string
  resource_type: string
  resource_id: string
  changes: Record<string, any>
  ip_address?: string
  user_agent?: string
  createdAt: Date
}

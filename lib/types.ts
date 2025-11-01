export type Role = "owner" | "admin" | "leader" | "staff" | "student" | "mentor"

export type Permission =
  | "org.manage"
  | "billing.manage"
  | "user.create"
  | "user.update"
  | "user.suspend"
  | "role.manage"
  | "module.toggle"
  | "room.manage"
  | "attendance.checkin"
  | "attendance.verify"
  | "payroll.view"
  | "task.create"
  | "task.assign"
  | "task.update.any"
  | "notes.create.shared"
  | "ai.use"
  | "iframe.embed"
  | "calendar.manage"
  | "leave.approve"
  | "student.view"
  | "student.evaluate"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: Role
  orgId: string
  teamId?: string
  createdAt: Date
}

export interface Organization {
  id: string
  name: string
  primaryLocation?: { lat: number; lon: number }
  allowedSsids?: string[]
  radius?: number
  createdAt: Date
}

export interface Membership {
  id: string
  userId: string
  orgId: string
  teamId?: string
  isOwner: boolean
  createdAt: Date
}

export interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "in-progress" | "review" | "done"
  priority: "low" | "medium" | "high" | "urgent"
  assigneeId?: string
  reporterId: string
  workspaceId: string
  orgId: string
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface AttendanceLog {
  id: string
  userId: string
  orgId: string
  type: "checkin" | "checkout"
  lat?: number
  lon?: number
  wifiSsid?: string
  status: "valid" | "pending" | "invalid"
  verifiedBy?: string
  verifiedAt?: Date
  createdAt: Date
}

export interface Note {
  id: string
  title: string
  content: string
  authorId: string
  orgId: string
  workspaceId?: string
  visibility: "private" | "team" | "org"
  pinned: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Room {
  id: string
  name: string
  capacity: number
  location: string
  orgId: string
  amenities: string[]
  available: boolean
}

export interface Booking {
  id: string
  roomId: string
  userId: string
  orgId: string
  title: string
  startTime: Date
  endTime: Date
  attendees: string[]
  status: "pending" | "confirmed" | "cancelled"
  createdAt: Date
}

export interface LeaveRequest {
  id: string
  userId: string
  orgId: string
  type: "sick" | "vacation" | "personal" | "other"
  startDate: Date
  endDate: Date
  reason: string
  status: "pending" | "approved" | "denied"
  reviewerId?: string
  reviewedAt?: Date
  createdAt: Date
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  location?: string
  orgId: string
  creatorId: string
  attendees: string[]
  type: "meeting" | "task" | "reminder" | "leave"
  color?: string
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
  orgId: string
  creatorId: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  enabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface WorkflowRun {
  id: string
  workflowId: string
  status: "running" | "success" | "failed"
  startedAt: Date
  completedAt?: Date
  logs: Array<{
    timestamp: Date
    level: "info" | "warning" | "error"
    message: string
  }>
}

export interface Module {
  id: string
  name: string
  type: "workflow" | "ai-content" | "scheduling" | "personal"
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
  userId: string
  toolId: string
  messages: Array<{
    role: "user" | "assistant" | "system"
    content: string
    timestamp: Date
  }>
  result?: any
  createdAt: Date
}

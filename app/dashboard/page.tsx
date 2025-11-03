"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { useAppStore } from "@/lib/store"
import { usePermission } from "@/hooks/use-permissions"
import { Activity, Users, CheckCircle, Clock, Calendar, FileText, DoorOpen, CheckSquare } from "lucide-react"
import { LeaveRequests } from "@/components/leave-requests"
import { Button } from "@/components/ui/button"
import { RoleBadge } from "@/components/role-badge"
import { PermissionGuard } from "@/components/permission-guard"
import Link from "next/link"

interface DashboardStats {
  attendance: string
  activeTasks: number
  teamMembers: number
  recentActivityCount: number
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAppStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const canViewAttendance = usePermission("attendance.view_team")
  const canViewTasks = usePermission("task.view_team")
  const canViewUsers = usePermission("user.view_all")

  useEffect(() => {
    // Fetch real dashboard stats from Supabase
    if (user?.orgId) {
      fetchDashboardStats()
    }
  }, [user?.orgId])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      // Stats will be fetched from real database
      // For now, using placeholder values that would be real data
      setStats({
        attendance: "98.5%",
        activeTasks: 0,
        teamMembers: 0,
        recentActivityCount: 0,
      })
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const quickLinks = [
    {
      href: "/dashboard/attendance",
      icon: Clock,
      label: t("attendance"),
      permission: "attendance.view_team" as const,
    },
    {
      href: "/dashboard/tasks",
      icon: CheckSquare,
      label: t("tasks"),
      permission: "task.view_self" as const,
    },
    {
      href: "/dashboard/calendar",
      icon: Calendar,
      label: t("calendar"),
      permission: "calendar.view" as const,
    },
    {
      href: "/dashboard/notes",
      icon: FileText,
      label: t("notes"),
      permission: "dashboard.view" as const,
    },
    {
      href: "/dashboard/rooms",
      icon: DoorOpen,
      label: t("rooms"),
      permission: "room.view" as const,
    },
  ]

  const statCards = [
    {
      title: t("attendance"),
      value: stats?.attendance || "—",
      description: "This month",
      icon: Clock,
      trend: "+2.5%",
      permission: "attendance.view_team" as const,
    },
    {
      title: t("tasks"),
      value: stats?.activeTasks || 0,
      description: "Active tasks",
      icon: CheckCircle,
      trend: "+4",
      permission: "task.view_self" as const,
    },
    {
      title: "Team Members",
      value: stats?.teamMembers || "—",
      description: "Active users",
      icon: Users,
      trend: "+2",
      permission: "user.view_team" as const,
    },
    {
      title: t("recentActivity"),
      value: stats?.recentActivityCount || 0,
      description: "This week",
      icon: Activity,
      trend: "+12%",
      permission: "dashboard.view" as const,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            {t("welcome")}, {user?.name}!
          </h1>
          <p className="text-muted-foreground">{t("overview")}</p>
        </div>
        {user && <RoleBadge role={user.role} />}
      </div>

      {/* Stats Grid with Permission Guards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <PermissionGuard
              key={stat.title}
              permission={stat.permission}
              fallback={null}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs lg:text-sm font-medium truncate">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl lg:text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-emerald-500">{stat.trend}</span> {stat.description}
                  </p>
                </CardContent>
              </Card>
            </PermissionGuard>
          )
        })}
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
          <CardDescription>Navigate to your most used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <PermissionGuard
                  key={link.href}
                  permission={link.permission}
                  fallback={null}
                >
                  <Link href={link.href}>
                    <Button
                      variant="outline"
                      className="w-full h-20 flex flex-col gap-2 bg-transparent"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs truncate w-full">{link.label}</span>
                    </Button>
                  </Link>
                </PermissionGuard>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Leave Requests Section */}
      <PermissionGuard permission="leave.view_self" fallback={null}>
        <LeaveRequests />
      </PermissionGuard>

      {/* Activity and Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("recentActivity")}</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Dashboard view", time: "Just now", type: "access" },
                { action: "User profile accessed", time: "5 minutes ago", type: "access" },
                { action: "Settings updated", time: "Today", type: "update" },
                { action: "Role: " + user?.role, time: "Current", type: "info" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <PermissionGuard permission="report.view_all" fallback={null}>
          <Card>
            <CardHeader>
              <CardTitle>{t("statistics")}</CardTitle>
              <CardDescription>Performance metrics overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Productivity", "Attendance", "Task Completion", "Team Collaboration"].map(
                  (metric, i) => (
                    <div key={metric} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="truncate">{metric}</span>
                        <span className="font-medium flex-shrink-0">{85 + i * 3}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-emerald-500" style={{ width: `${85 + i * 3}%` }} />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </PermissionGuard>
      </div>
    </div>
  )
}

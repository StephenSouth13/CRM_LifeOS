"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { useAppStore } from "@/lib/store"
import { Activity, Users, CheckCircle, Clock, Calendar, FileText, DoorOpen, CheckSquare } from "lucide-react"
import { LeaveRequests } from "@/components/leave-requests"
import { Button } from "@/components/ui/button"
import { RoleBadge } from "@/components/role-badge"
import Link from "next/link"

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAppStore()

  const stats = [
    {
      title: t("attendance"),
      value: "98.5%",
      description: "This month",
      icon: Clock,
      trend: "+2.5%",
    },
    {
      title: t("tasks"),
      value: "24",
      description: "Active tasks",
      icon: CheckCircle,
      trend: "+4",
    },
    {
      title: "Team Members",
      value: "12",
      description: "Active users",
      icon: Users,
      trend: "+2",
    },
    {
      title: t("recentActivity"),
      value: "156",
      description: "This week",
      icon: Activity,
      trend: "+12%",
    },
  ]

  const quickLinks = [
    { href: "/dashboard/attendance", icon: Clock, label: t("attendance") },
    { href: "/dashboard/tasks", icon: CheckSquare, label: t("tasks") },
    { href: "/dashboard/calendar", icon: Calendar, label: t("calendar") },
    { href: "/dashboard/notes", icon: FileText, label: t("notes") },
    { href: "/dashboard/rooms", icon: DoorOpen, label: t("rooms") },
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

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs lg:text-sm font-medium truncate">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </CardHeader>
              <CardContent>
                <div className="text-xl lg:text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500">{stat.trend}</span> {stat.description}
                </p>
              </CardContent>
            </Card>
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
                <Link key={link.href} href={link.href}>
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent touch-target">
                    <Icon className="h-5 w-5" />
                    <span className="text-xs truncate w-full">{link.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Leave Requests Section */}
      <LeaveRequests />

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
                { action: "Checked in", time: "2 hours ago", type: "attendance" },
                { action: "Completed task: Update documentation", time: "4 hours ago", type: "task" },
                { action: "Booked Conference Room A", time: "Yesterday", type: "booking" },
                { action: "Created note: Meeting notes", time: "2 days ago", type: "note" },
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

        <Card>
          <CardHeader>
            <CardTitle>{t("statistics")}</CardTitle>
            <CardDescription>Performance metrics overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Productivity", "Attendance", "Task Completion", "Team Collaboration"].map((metric, i) => (
                <div key={metric} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate">{metric}</span>
                    <span className="font-medium flex-shrink-0">{85 + i * 3}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-emerald-500" style={{ width: `${85 + i * 3}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

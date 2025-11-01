"use client"

import {
  Activity,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react"

import { useAppStore } from "@/lib/store"
import { useTranslation } from "@/hooks/use-translation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RoleBadge } from "@/components/role-badge"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { LeaveRequests } from "@/components/leave-requests"
import { TaskList } from "@/components/task-list"

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAppStore()

  const stats = [
    {
      title: t("attendance"),
      value: "98.5%",
      description: "This month",
      icon: Clock,
    },
    {
      title: t("tasks"),
      value: "24",
      description: "Active tasks",
      icon: CheckCircle,
    },
    {
      title: "Team Members",
      value: "12",
      description: "Active users",
      icon: Users,
    },
    {
      title: t("productivity"),
      value: "92%",
      description: "This week",
      icon: Activity,
    },
  ]

  const chartData = [
    { day: "Monday", tasks: 4, productivity: 80 },
    { day: "Tuesday", tasks: 6, productivity: 85 },
    { day: "Wednesday", tasks: 5, productivity: 88 },
    { day: "Thursday", tasks: 8, productivity: 92 },
    { day: "Friday", tasks: 7, productivity: 90 },
    { day: "Saturday", tasks: 2, productivity: 70 },
    { day: "Sunday", tasks: 1, productivity: 60 },
  ]
  
  const recentActivities = [
      { action: "Checked in", time: "2 hours ago" },
      { action: "Completed task: Update documentation", time: "4 hours ago" },
      { action: "Booked Conference Room A", time: "Yesterday" },
      { action: "Created note: Meeting notes", time: "2 days ago" },
  ]


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                {t("welcome")}, {user?.name}!
            </h1>
            <p className="text-muted-foreground">{t("overview")}</p>
        </div>
        {user && <RoleBadge role={user.role} />}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Weekly Productivity</CardTitle>
            <CardDescription>Tasks completed and productivity levels for the week.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={{}} className="h-[350px] w-full">
              <BarChart data={chartData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="tasks" fill="var(--color-primary)" radius={8} />
                <Bar dataKey="productivity" fill="var(--color-accent)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{t("recentActivity")}</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, i) => (
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
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TaskList />
        <LeaveRequests />
      </div>
    </div>
  )
}

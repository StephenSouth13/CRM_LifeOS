"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { Users, UserCheck, UserPlus, Activity } from "lucide-react"

export function AdminStats() {
  const { t } = useTranslation()

  const stats = [
    {
      title: t("totalUsers"),
      value: "156",
      icon: Users,
      description: "All registered users",
      trend: "+12%",
    },
    {
      title: t("activeUsers"),
      value: "142",
      icon: UserCheck,
      description: "Currently active",
      trend: "+8%",
    },
    {
      title: t("newUsers"),
      value: "24",
      icon: UserPlus,
      description: "This month",
      trend: "+18%",
    },
    {
      title: t("systemHealth"),
      value: "99.8%",
      icon: Activity,
      description: "Uptime",
      trend: "+0.2%",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-accent">{stat.trend}</span> {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { Clock, TrendingUp, Calendar, Award } from "lucide-react"

export function AttendanceStats() {
  const { t } = useTranslation()

  const stats = [
    {
      title: t("thisWeek"),
      value: "40h 30m",
      icon: Clock,
      description: t("totalHours"),
    },
    {
      title: t("thisMonth"),
      value: "168h 45m",
      icon: Calendar,
      description: t("totalHours"),
    },
    {
      title: t("averageHours"),
      value: "8h 15m",
      icon: TrendingUp,
      description: "Per day",
    },
    {
      title: "Attendance Rate",
      value: "98.5%",
      icon: Award,
      description: t("thisMonth"),
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
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

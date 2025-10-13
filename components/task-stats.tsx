"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react"

export function TaskStats() {
  const { t } = useTranslation()

  const stats = [
    {
      title: t("allTasks"),
      value: "24",
      icon: Circle,
      description: "Total tasks",
    },
    {
      title: t("inProgress"),
      value: "8",
      icon: Clock,
      description: "Active now",
    },
    {
      title: t("completed"),
      value: "14",
      icon: CheckCircle2,
      description: "This month",
    },
    {
      title: t("overdue"),
      value: "2",
      icon: AlertCircle,
      description: "Need attention",
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

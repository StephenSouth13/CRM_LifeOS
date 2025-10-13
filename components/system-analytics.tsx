"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"

export function SystemAnalytics() {
  const { t } = useTranslation()

  const metrics = [
    { label: "CPU Usage", value: "45%", color: "bg-accent" },
    { label: "Memory Usage", value: "62%", color: "bg-primary" },
    { label: "Disk Usage", value: "38%", color: "bg-chart-3" },
    { label: "Network Load", value: "28%", color: "bg-chart-4" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t("analytics")}</CardTitle>
          <CardDescription>System performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{metric.label}</span>
                  <span className="font-medium">{metric.value}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className={`h-full ${metric.color}`} style={{ width: metric.value }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("recentActivity")}</CardTitle>
          <CardDescription>Latest system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { event: "User login", user: "john.doe@company.com", time: "2 min ago" },
              { event: "Task created", user: "jane.smith@company.com", time: "15 min ago" },
              { event: "Report generated", user: "System", time: "1 hour ago" },
              { event: "User registered", user: "new.user@company.com", time: "2 hours ago" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.event}</p>
                  <p className="text-xs text-muted-foreground">{activity.user}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/hooks/use-translation"
import { Clock } from "lucide-react"

const mockHistory = [
  { date: "2025-01-13", checkIn: "08:45", checkOut: "17:30", hours: "8h 45m", status: "present" },
  { date: "2025-01-12", checkIn: "09:15", checkOut: "17:45", hours: "8h 30m", status: "late" },
  { date: "2025-01-11", checkIn: "08:30", checkOut: "17:00", hours: "8h 30m", status: "present" },
  { date: "2025-01-10", checkIn: "08:50", checkOut: "16:30", hours: "7h 40m", status: "earlyLeave" },
  { date: "2025-01-09", checkIn: "08:40", checkOut: "17:20", hours: "8h 40m", status: "present" },
]

export function AttendanceHistory() {
  const { t } = useTranslation()

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      present: { variant: "default", label: t("present") },
      late: { variant: "secondary", label: t("late") },
      absent: { variant: "destructive", label: t("absent") },
      earlyLeave: { variant: "outline", label: t("earlyLeave") },
    }
    const config = variants[status] || variants.present
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("attendanceHistory")}</CardTitle>
        <CardDescription>Recent attendance records</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockHistory.map((record) => (
            <div
              key={record.date}
              className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent/50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{new Date(record.date).toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground">
                    {record.checkIn} - {record.checkOut}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium">{record.hours}</p>
                  <p className="text-sm text-muted-foreground">{t("workingHours")}</p>
                </div>
                {getStatusBadge(record.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

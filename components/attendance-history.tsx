"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/hooks/use-translation"
import { useAppStore } from "@/lib/store"
import { Clock, AlertCircle } from "lucide-react"
import type { AttendanceLog } from "@/lib/types"

export function AttendanceHistory() {
  const { t } = useTranslation()
  const { user } = useAppStore()
  const [attendance, setAttendance] = useState<AttendanceLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id && user?.orgId) {
      fetchAttendance()
    }
  }, [user?.id, user?.orgId])

  const fetchAttendance = async () => {
    try {
      const response = await fetch(
        `/api/attendance?user_id=${user?.id}&org_id=${user?.orgId}&limit=10`,
      )
      if (response.ok) {
        const data = await response.json()
        setAttendance(data.logs || [])
      }
    } catch (error) {
      console.error("Failed to fetch attendance:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      valid: { variant: "default", label: "Present" },
      late: { variant: "secondary", label: "Late" },
      invalid: { variant: "destructive", label: "Absent" },
      pending: { variant: "outline", label: "Pending" },
    }
    const config = variants[status] || variants.valid
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("attendanceHistory")}</CardTitle>
        <CardDescription>Your recent attendance records</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading attendance history...</p>
          </div>
        ) : attendance.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No attendance records found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {attendance.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {record.check_in_time ? new Date(record.check_in_time).toLocaleDateString() : "—"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {record.check_in_time
                        ? new Date(record.check_in_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "—"}{" "}
                      -{" "}
                      {record.check_out_time
                        ? new Date(record.check_out_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "—"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(record.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

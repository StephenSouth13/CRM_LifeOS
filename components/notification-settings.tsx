"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useTranslation } from "@/hooks/use-translation"
import { Mail, Smartphone } from "lucide-react"

export function NotificationSettings() {
  const { t } = useTranslation()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [taskReminders, setTaskReminders] = useState(true)
  const [attendanceAlerts, setAttendanceAlerts] = useState(false)
  const [weeklyReports, setWeeklyReports] = useState(true)
  const [systemUpdates, setSystemUpdates] = useState(true)

  const notificationGroups = [
    {
      title: t("emailNotifications"),
      description: "Receive notifications via email",
      icon: Mail,
      enabled: emailNotifications,
      setEnabled: setEmailNotifications,
    },
    {
      title: t("pushNotifications"),
      description: "Receive push notifications on your device",
      icon: Smartphone,
      enabled: pushNotifications,
      setEnabled: setPushNotifications,
    },
  ]

  const notificationTypes = [
    {
      title: t("taskReminders"),
      description: "Get reminded about upcoming tasks",
      enabled: taskReminders,
      setEnabled: setTaskReminders,
    },
    {
      title: t("attendanceAlerts"),
      description: "Alerts for attendance check-in/out",
      enabled: attendanceAlerts,
      setEnabled: setAttendanceAlerts,
    },
    {
      title: t("weeklyReports"),
      description: "Receive weekly performance reports",
      enabled: weeklyReports,
      setEnabled: setWeeklyReports,
    },
    {
      title: t("systemUpdates"),
      description: "Important system updates and announcements",
      enabled: systemUpdates,
      setEnabled: setSystemUpdates,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("notifications")}</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {notificationGroups.map((group) => {
            const Icon = group.icon
            return (
              <div key={group.title} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{group.title}</p>
                    <p className="text-sm text-muted-foreground">{group.description}</p>
                  </div>
                </div>
                <Switch checked={group.enabled} onCheckedChange={group.setEnabled} />
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>Choose which notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationTypes.map((type) => (
            <div key={type.title} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{type.title}</p>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </div>
              <Switch checked={type.enabled} onCheckedChange={type.setEnabled} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

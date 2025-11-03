"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/hooks/use-translation"
import { useAppStore } from "@/lib/store"
import { AlertCircle } from "lucide-react"
import type { CalendarEvent } from "@/lib/types"

export function CalendarView() {
  const { t } = useTranslation()
  const { user } = useAppStore()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    if (user?.orgId) {
      fetchEvents()
    }
  }, [user?.orgId])

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        `/api/calendar?org_id=${user?.orgId}`,
      )
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error("Failed to fetch events:", error)
    } finally {
      setLoading(false)
    }
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start_time)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      meeting: "bg-blue-100 text-blue-700",
      task: "bg-purple-100 text-purple-700",
      reminder: "bg-amber-100 text-amber-700",
      leave: "bg-red-100 text-red-700",
      event: "bg-green-100 text-green-700",
    }
    return colors[type] || colors.event
  }

  const dayEvents = getEventsForDate(selectedDate)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("calendar")}</CardTitle>
        <CardDescription>Your calendar events</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading calendar...</p>
          </div>
        ) : dayEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No events for this date</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{event.title}</h4>
                  <Badge className={`text-xs ${getTypeColor(event.type)}`}>
                    {event.type}
                  </Badge>
                </div>
                {event.description && (
                  <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {new Date(event.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                  {new Date(event.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

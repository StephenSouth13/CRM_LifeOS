"use client"

import { useState } from "react"
import { useTranslation } from "@/hooks/use-translation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users } from "lucide-react"
import { motion } from "framer-motion"
import type { CalendarEvent } from "@/lib/types"

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Standup",
    description: "Daily team sync",
    startTime: new Date(2025, 0, 13, 9, 0),
    endTime: new Date(2025, 0, 13, 9, 30),
    location: "Room A",
    orgId: "org-1",
    creatorId: "1",
    attendees: ["1", "2", "3"],
    type: "meeting",
    color: "blue",
  },
  {
    id: "2",
    title: "Project Review",
    description: "Q1 project review meeting",
    startTime: new Date(2025, 0, 13, 14, 0),
    endTime: new Date(2025, 0, 13, 16, 0),
    location: "Conference Room",
    orgId: "org-1",
    creatorId: "2",
    attendees: ["1", "2", "3", "4"],
    type: "meeting",
    color: "purple",
  },
  {
    id: "3",
    title: "Complete Task Report",
    startTime: new Date(2025, 0, 14, 10, 0),
    endTime: new Date(2025, 0, 14, 12, 0),
    orgId: "org-1",
    creatorId: "1",
    attendees: ["1"],
    type: "task",
    color: "emerald",
  },
]

export function CalendarView() {
  const { t } = useTranslation()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const getEventsForDate = (date: Date | null) => {
    if (!date) return []
    return mockEvents.filter((event) => {
      const eventDate = new Date(event.startTime)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">{formatMonthYear(currentDate)}</h2>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              {t("today")}
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1 border rounded-lg p-1">
            <Button variant={view === "month" ? "default" : "ghost"} size="sm" onClick={() => setView("month")}>
              {t("month")}
            </Button>
            <Button variant={view === "week" ? "default" : "ghost"} size="sm" onClick={() => setView("week")}>
              {t("week")}
            </Button>
            <Button variant={view === "day" ? "default" : "ghost"} size="sm" onClick={() => setView("day")}>
              Day
            </Button>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t("createEvent")}
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-4">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, index) => {
              const events = getEventsForDate(date)
              const today = isToday(date)

              return (
                <motion.div
                  key={index}
                  className={`min-h-24 p-2 rounded-lg border transition-colors ${
                    date ? "bg-card hover:bg-accent/50 cursor-pointer" : "bg-muted/20"
                  } ${today ? "border-emerald-500 border-2" : "border-border"}`}
                  whileHover={date ? { scale: 1.02 } : {}}
                >
                  {date && (
                    <>
                      <div className={`text-sm font-medium mb-1 ${today ? "text-emerald-500" : ""}`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {events.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded truncate bg-${event.color}-500/10 text-${event.color}-500 border border-${event.color}-500/20`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {events.length > 2 && (
                          <div className="text-xs text-muted-foreground">+{events.length - 2} more</div>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockEvents.map((event) => (
            <motion.div
              key={event.id}
              className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
              whileHover={{ x: 4 }}
            >
              <div className={`w-1 h-full rounded-full bg-${event.color}-500`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-medium truncate">{event.title}</h4>
                  <Badge variant="outline" className="flex-shrink-0">
                    {event.type}
                  </Badge>
                </div>
                {event.description && <p className="text-sm text-muted-foreground mb-2">{event.description}</p>}
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {event.attendees.length} attendees
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

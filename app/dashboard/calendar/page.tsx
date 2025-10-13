"use client"

import { useState } from "react"
import { useTranslation } from "@/hooks/use-translation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  Bell,
  Repeat,
  CalendarIcon,
  List,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

interface CalendarEvent {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  location?: string
  attendees: string[]
  type: "meeting" | "task" | "event" | "holiday" | "birthday"
  color: string
  recurring?: "daily" | "weekly" | "monthly" | "yearly" | "never"
  reminders?: { time: number; unit: "minutes" | "hours" | "days" }[]
  allDay?: boolean
}

export default function CalendarPage() {
  const { t } = useTranslation()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day" | "agenda">("month")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Team Standup",
      description: "Daily team sync meeting",
      startTime: new Date(2025, 0, 13, 9, 0),
      endTime: new Date(2025, 0, 13, 9, 30),
      location: "Room A",
      attendees: ["1", "2", "3"],
      type: "meeting",
      color: "blue",
      recurring: "daily",
      reminders: [{ time: 15, unit: "minutes" }],
    },
    {
      id: "2",
      title: "Project Review",
      description: "Q1 project review meeting with stakeholders",
      startTime: new Date(2025, 0, 13, 14, 0),
      endTime: new Date(2025, 0, 13, 16, 0),
      location: "Conference Room",
      attendees: ["1", "2", "3", "4"],
      type: "meeting",
      color: "purple",
      reminders: [
        { time: 1, unit: "hours" },
        { time: 1, unit: "days" },
      ],
    },
    {
      id: "3",
      title: "Complete Task Report",
      startTime: new Date(2025, 0, 14, 10, 0),
      endTime: new Date(2025, 0, 14, 12, 0),
      attendees: ["1"],
      type: "task",
      color: "emerald",
      reminders: [{ time: 30, unit: "minutes" }],
    },
    {
      id: "4",
      title: "Company Holiday",
      startTime: new Date(2025, 0, 15, 0, 0),
      endTime: new Date(2025, 0, 15, 23, 59),
      attendees: [],
      type: "holiday",
      color: "red",
      allDay: true,
    },
  ])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const getEventsForDate = (date: Date | null) => {
    if (!date) return []
    return events.filter((event) => {
      const eventDate = new Date(event.startTime)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const getUpcomingEvents = () => {
    const now = new Date()
    return events
      .filter((event) => event.startTime >= now)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      .slice(0, 5)
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      meeting: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      task: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      event: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      holiday: "bg-red-500/10 text-red-600 border-red-500/20",
      birthday: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    }
    return colors[type] || colors.event
  }

  const days = getDaysInMonth(currentDate)
  const upcomingEvents = getUpcomingEvents()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            {t("calendar")}
          </h1>
          <p className="text-muted-foreground">{t("myCalendar")}</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              {t("createEvent")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("createEvent")}</DialogTitle>
              <DialogDescription>Add a new event to your calendar</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">{t("eventTitle")}</Label>
                <Input id="title" placeholder="Enter event title" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">{t("eventDescription")}</Label>
                <Textarea id="description" placeholder="Enter event description" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start">{t("startTime")}</Label>
                  <Input id="start" type="datetime-local" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end">{t("endTime")}</Label>
                  <Input id="end" type="datetime-local" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="allday" />
                <Label htmlFor="allday">{t("allDay")}</Label>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">{t("location")}</Label>
                <Input id="location" placeholder="Enter location" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Event Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meeting">{t("meeting")}</SelectItem>
                    <SelectItem value="task">{t("task")}</SelectItem>
                    <SelectItem value="event">{t("event")}</SelectItem>
                    <SelectItem value="holiday">{t("holiday")}</SelectItem>
                    <SelectItem value="birthday">{t("birthday")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="recurring">{t("recurringEvent")}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">{t("never")}</SelectItem>
                    <SelectItem value="daily">{t("daily")}</SelectItem>
                    <SelectItem value="weekly">{t("weekly")}</SelectItem>
                    <SelectItem value="monthly">{t("monthly")}</SelectItem>
                    <SelectItem value="yearly">{t("yearly")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>{t("addReminder")}</Label>
                <div className="flex gap-2">
                  <Input type="number" placeholder="15" className="w-20" />
                  <Select>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">{t("minutes")}</SelectItem>
                      <SelectItem value="hours">{t("hours")}</SelectItem>
                      <SelectItem value="days">{t("days")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="flex items-center text-sm text-muted-foreground">{t("before")}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                {t("cancel")}
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>{t("save")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

            <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-auto">
              <TabsList>
                <TabsTrigger value="month">{t("month")}</TabsTrigger>
                <TabsTrigger value="week">{t("week")}</TabsTrigger>
                <TabsTrigger value="day">{t("day")}</TabsTrigger>
                <TabsTrigger value="agenda">{t("agenda")}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Views */}
      <AnimatePresence mode="wait">
        {view === "month" && (
          <motion.div
            key="month"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
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
                    const dayEvents = getEventsForDate(date)
                    const today = isToday(date)

                    return (
                      <motion.div
                        key={index}
                        className={`min-h-28 p-2 rounded-lg border transition-all ${
                          date ? "bg-card hover:bg-accent/50 cursor-pointer hover:shadow-md" : "bg-muted/20"
                        } ${today ? "border-emerald-500 border-2 shadow-lg shadow-emerald-500/20" : "border-border"}`}
                        whileHover={date ? { scale: 1.02 } : {}}
                        onClick={() => date && setSelectedDate(date)}
                      >
                        {date && (
                          <>
                            <div className={`text-sm font-medium mb-1 ${today ? "text-emerald-500 font-bold" : ""}`}>
                              {date.getDate()}
                            </div>
                            <div className="space-y-1">
                              {dayEvents.slice(0, 3).map((event) => (
                                <div
                                  key={event.id}
                                  className={`text-xs p-1 rounded truncate border ${getEventTypeColor(event.type)}`}
                                >
                                  {event.allDay ? "🌟 " : ""}
                                  {event.title}
                                </div>
                              ))}
                              {dayEvents.length > 3 && (
                                <div className="text-xs text-muted-foreground font-medium">
                                  +{dayEvents.length - 3} more
                                </div>
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
          </motion.div>
        )}

        {view === "agenda" && (
          <motion.div
            key="agenda"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="h-5 w-5" />
                  {t("agenda")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {events.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{t("noEvents")}</p>
                  </div>
                ) : (
                  events
                    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
                    .map((event) => (
                      <motion.div
                        key={event.id}
                        className="flex items-start gap-3 p-4 rounded-lg border hover:bg-accent/50 transition-all cursor-pointer group"
                        whileHover={{ x: 4 }}
                      >
                        <div className={`w-1 h-full rounded-full bg-${event.color}-500`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h4 className="font-semibold text-lg">{event.title}</h4>
                              <p className="text-sm text-muted-foreground">{formatDate(event.startTime)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getEventTypeColor(event.type)}>
                                {t(event.type)}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    {t("editEvent")}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {t("deleteEvent")}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                          )}
                          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                            {!event.allDay && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(event.startTime)} - {formatTime(event.endTime)}
                              </div>
                            )}
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </div>
                            )}
                            {event.attendees.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {event.attendees.length} {t("attendees")}
                              </div>
                            )}
                            {event.recurring && event.recurring !== "never" && (
                              <div className="flex items-center gap-1">
                                <Repeat className="h-3 w-3" />
                                {t(event.recurring)}
                              </div>
                            )}
                            {event.reminders && event.reminders.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Bell className="h-3 w-3" />
                                {event.reminders.length} {t("reminder")}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upcoming Events Sidebar */}
      {view === "month" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t("upcomingEvents")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>{t("noEvents")}</p>
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <motion.div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                  whileHover={{ x: 4 }}
                >
                  <div className={`w-1 h-full rounded-full bg-${event.color}-500`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-medium truncate">{event.title}</h4>
                      <Badge variant="outline" className={`flex-shrink-0 ${getEventTypeColor(event.type)}`}>
                        {t(event.type)}
                      </Badge>
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{event.description}</p>
                    )}
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
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

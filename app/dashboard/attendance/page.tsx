"use client"

import { useState } from "react"
import { useTranslation } from "@/hooks/use-translation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Clock,
  MapPin,
  TrendingUp,
  Calendar,
  Award,
  Download,
  Filter,
  CalendarDays,
  List,
  BarChart3,
  Home,
  Building2,
  Coffee,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AttendanceRecord {
  id: string
  date: string
  checkIn: string | null
  checkOut: string | null
  hours: string
  status: "present" | "late" | "absent" | "earlyLeave" | "onLeave" | "holiday"
  location: "office" | "home"
  breakTime?: string
}

export default function AttendancePage() {
  const { t } = useTranslation()
  const [view, setView] = useState<"overview" | "calendar" | "list">("overview")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterMonth, setFilterMonth] = useState<string>("current")
  const [checkInTime, setCheckInTime] = useState<string | null>(null)
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [workLocation, setWorkLocation] = useState<"office" | "home">("office")

  // Update current time every second
  useState(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  })

  const [attendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: "1",
      date: "2025-01-13",
      checkIn: "08:45",
      checkOut: "17:30",
      hours: "8h 45m",
      status: "present",
      location: "office",
      breakTime: "1h",
    },
    {
      id: "2",
      date: "2025-01-12",
      checkIn: "09:15",
      checkOut: "17:45",
      hours: "8h 30m",
      status: "late",
      location: "office",
      breakTime: "1h",
    },
    {
      id: "3",
      date: "2025-01-11",
      checkIn: "08:30",
      checkOut: "17:00",
      hours: "8h 30m",
      status: "present",
      location: "home",
      breakTime: "1h",
    },
    {
      id: "4",
      date: "2025-01-10",
      checkIn: "08:50",
      checkOut: "16:30",
      hours: "7h 40m",
      status: "earlyLeave",
      location: "office",
      breakTime: "1h",
    },
    {
      id: "5",
      date: "2025-01-09",
      checkIn: "08:40",
      checkOut: "17:20",
      hours: "8h 40m",
      status: "present",
      location: "office",
      breakTime: "1h",
    },
    {
      id: "6",
      date: "2025-01-08",
      checkIn: null,
      checkOut: null,
      hours: "0h",
      status: "onLeave",
      location: "office",
    },
    {
      id: "7",
      date: "2025-01-07",
      checkIn: null,
      checkOut: null,
      hours: "0h",
      status: "holiday",
      location: "office",
    },
  ])

  const handleCheckIn = () => {
    setCheckInTime(currentTime.toLocaleTimeString())
  }

  const handleCheckOut = () => {
    setCheckOutTime(currentTime.toLocaleTimeString())
  }

  const calculateWorkingHours = () => {
    if (!checkInTime || !checkOutTime) return "0h 0m"
    const checkIn = new Date(`2000-01-01 ${checkInTime}`)
    const checkOut = new Date(`2000-01-01 ${checkOutTime}`)
    const diff = checkOut.getTime() - checkIn.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      present: {
        className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        label: t("present"),
      },
      late: {
        className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
        label: t("late"),
      },
      absent: {
        className: "bg-red-500/10 text-red-600 border-red-500/20",
        label: t("absent"),
      },
      earlyLeave: {
        className: "bg-orange-500/10 text-orange-600 border-orange-500/20",
        label: t("earlyLeave"),
      },
      onLeave: {
        className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        label: t("onLeave"),
      },
      holiday: {
        className: "bg-purple-500/10 text-purple-600 border-purple-500/20",
        label: t("holiday"),
      },
    }
    const config = variants[status] || variants.present
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const stats = [
    {
      title: t("thisWeek"),
      value: "40h 30m",
      icon: Clock,
      description: t("totalHours"),
      trend: "+2.5%",
      color: "text-blue-600",
    },
    {
      title: t("thisMonth"),
      value: "168h 45m",
      icon: Calendar,
      description: t("workingDays") + ": 21",
      trend: "+5.2%",
      color: "text-emerald-600",
    },
    {
      title: t("leaveBalance"),
      value: "12 days",
      icon: Award,
      description: t("daysOff") + ": 3",
      trend: "-3 days",
      color: "text-yellow-600",
    },
    {
      title: t("attendanceRate"),
      value: "98.5%",
      icon: TrendingUp,
      description: t("perfectAttendance"),
      trend: "+1.2%",
      color: "text-purple-600",
    },
  ]

  const filteredRecords = attendanceRecords.filter((record) => {
    if (filterStatus !== "all" && record.status !== filterStatus) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            {t("attendance")}
          </h1>
          <p className="text-muted-foreground">{t("attendanceHistory")}</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t("exportReport")}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                    <span className="text-xs font-medium text-emerald-600">{stat.trend}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Check In/Out Card */}
      <Card className="border-2 border-gradient-to-r from-blue-500 to-emerald-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t("todayAttendance")}
          </CardTitle>
          <CardDescription>{currentTime.toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Live Clock */}
          <div className="flex items-center justify-center">
            <motion.div
              className="text-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-2 text-6xl font-bold tabular-nums bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{workLocation === "office" ? t("workFromOffice") : t("workFromHome")}</span>
                </div>
                <Select value={workLocation} onValueChange={(v: any) => setWorkLocation(v)}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Office
                      </div>
                    </SelectItem>
                    <SelectItem value="home">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Home
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          </div>

          {/* Check In/Out Buttons */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("checkInTime")}</span>
                {checkInTime && (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    <Clock className="mr-1 h-3 w-3" />
                    {checkInTime}
                  </Badge>
                )}
              </div>
              <Button
                onClick={handleCheckIn}
                disabled={!!checkInTime}
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                size="lg"
              >
                {t("checkIn")}
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("checkOutTime")}</span>
                {checkOutTime && (
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                    <Clock className="mr-1 h-3 w-3" />
                    {checkOutTime}
                  </Badge>
                )}
              </div>
              <Button
                onClick={handleCheckOut}
                disabled={!checkInTime || !!checkOutTime}
                variant="outline"
                className="w-full bg-transparent"
                size="lg"
              >
                {t("checkOut")}
              </Button>
            </div>
          </div>

          {/* Working Hours Display */}
          {checkInTime && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-lg border-2 border-emerald-500/20 bg-gradient-to-r from-blue-500/5 to-emerald-500/5 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coffee className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium">{t("workingHours")}</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  {calculateWorkingHours()}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{t("expectedHours")}: 8h 0m</span>
                <span>{t("breakTime")}: 1h 0m</span>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Records */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t("attendanceReport")}
            </CardTitle>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">{t("present")}</SelectItem>
                  <SelectItem value="late">{t("late")}</SelectItem>
                  <SelectItem value="absent">{t("absent")}</SelectItem>
                  <SelectItem value="earlyLeave">{t("earlyLeave")}</SelectItem>
                  <SelectItem value="onLeave">{t("onLeave")}</SelectItem>
                  <SelectItem value="holiday">{t("holiday")}</SelectItem>
                </SelectContent>
              </Select>
              <Tabs value={view} onValueChange={(v: any) => setView(v)} className="w-auto">
                <TabsList>
                  <TabsTrigger value="overview">
                    <BarChart3 className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="calendar">
                    <CalendarDays className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list">
                    <List className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {view === "list" && (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {filteredRecords.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between rounded-lg border border-border p-4 transition-all hover:bg-accent/50 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-emerald-500/10">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{new Date(record.date).toLocaleDateString()}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {record.checkIn && record.checkOut ? (
                            <>
                              <span>
                                {record.checkIn} - {record.checkOut}
                              </span>
                              {record.breakTime && (
                                <>
                                  <span>•</span>
                                  <span>
                                    {t("breakTime")}: {record.breakTime}
                                  </span>
                                </>
                              )}
                            </>
                          ) : (
                            <span>No attendance</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-lg">{record.hours}</p>
                        <p className="text-xs text-muted-foreground">
                          {record.location === "office" ? (
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              Office
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Home className="h-3 w-3" />
                              Home
                            </span>
                          )}
                        </p>
                      </div>
                      {getStatusBadge(record.status)}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {view === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-emerald-600">21</div>
                        <p className="text-sm text-muted-foreground">{t("workingDays")}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-600">2</div>
                        <p className="text-sm text-muted-foreground">{t("lateCount")}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">3.5h</div>
                        <p className="text-sm text-muted-foreground">{t("overtimeHours")}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Records */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Recent Activity</h3>
                  {filteredRecords.slice(0, 5).map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sm">
                          <p className="font-medium">{new Date(record.date).toLocaleDateString()}</p>
                          <p className="text-muted-foreground">
                            {record.checkIn && record.checkOut
                              ? `${record.checkIn} - ${record.checkOut}`
                              : "No attendance"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{record.hours}</span>
                        {getStatusBadge(record.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}

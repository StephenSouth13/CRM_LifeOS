"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/hooks/use-translation"
import { Clock, MapPin } from "lucide-react"
import { motion } from "framer-motion"

export function AttendanceCheckIn() {
  const { t } = useTranslation()
  const [checkInTime, setCheckInTime] = useState<string | null>(null)
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())

  useState(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(interval)
  })

  const handleCheckIn = () => {
    setCheckInTime(new Date().toLocaleTimeString())
  }

  const handleCheckOut = () => {
    setCheckOutTime(new Date().toLocaleTimeString())
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("todayAttendance")}</CardTitle>
        <CardDescription>{new Date().toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-2 text-5xl font-bold tabular-nums">{currentTime}</div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Office Location</span>
            </div>
          </motion.div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t("checkInTime")}</span>
              {checkInTime && (
                <Badge variant="outline" className="bg-accent/10">
                  <Clock className="mr-1 h-3 w-3" />
                  {checkInTime}
                </Badge>
              )}
            </div>
            <Button onClick={handleCheckIn} disabled={!!checkInTime} className="w-full" size="lg">
              {t("checkIn")}
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t("checkOutTime")}</span>
              {checkOutTime && (
                <Badge variant="outline" className="bg-accent/10">
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

        {checkInTime && (
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t("workingHours")}</span>
              <span className="text-lg font-bold">{calculateWorkingHours()}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

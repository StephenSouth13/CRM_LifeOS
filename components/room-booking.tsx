"use client"

import type React from "react"

import { useState } from "react"
import { useTranslation } from "@/hooks/use-translation"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DoorOpen, Users, MapPin, Wifi, Monitor, Coffee, Calendar, Clock, Plus, Check, X } from "lucide-react"
import { motion } from "framer-motion"
import type { Room, Booking } from "@/lib/types"

const mockRooms: Room[] = [
  {
    id: "1",
    name: "Conference Room A",
    capacity: 12,
    location: "Floor 2, East Wing",
    orgId: "org-1",
    amenities: ["Projector", "Whiteboard", "Video Conference", "WiFi"],
    available: true,
  },
  {
    id: "2",
    name: "Meeting Room B",
    capacity: 6,
    location: "Floor 3, West Wing",
    orgId: "org-1",
    amenities: ["TV Screen", "Whiteboard", "WiFi"],
    available: true,
  },
  {
    id: "3",
    name: "Executive Boardroom",
    capacity: 20,
    location: "Floor 5, Center",
    orgId: "org-1",
    amenities: ["Projector", "Video Conference", "WiFi", "Coffee Machine", "Catering"],
    available: false,
  },
  {
    id: "4",
    name: "Small Meeting Room",
    capacity: 4,
    location: "Floor 2, North Wing",
    orgId: "org-1",
    amenities: ["TV Screen", "WiFi"],
    available: true,
  },
]

const mockBookings: Booking[] = [
  {
    id: "1",
    roomId: "1",
    userId: "1",
    orgId: "org-1",
    title: "Team Standup",
    startTime: new Date(2025, 0, 13, 9, 0),
    endTime: new Date(2025, 0, 13, 10, 0),
    attendees: ["1", "2", "3"],
    status: "confirmed",
    createdAt: new Date(),
  },
  {
    id: "2",
    roomId: "3",
    userId: "2",
    orgId: "org-1",
    title: "Board Meeting",
    startTime: new Date(2025, 0, 13, 14, 0),
    endTime: new Date(2025, 0, 13, 16, 0),
    attendees: ["1", "2", "3", "4"],
    status: "confirmed",
    createdAt: new Date(),
  },
]

export function RoomBooking() {
  const { t } = useTranslation()
  const { user } = useAppStore()
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)
  const [filterCapacity, setFilterCapacity] = useState<string>("all")
  const [filterAvailability, setFilterAvailability] = useState<string>("all")

  const filteredRooms = mockRooms.filter((room) => {
    const matchesCapacity = filterCapacity === "all" || room.capacity >= Number.parseInt(filterCapacity)
    const matchesAvailability = filterAvailability === "all" || room.available.toString() === filterAvailability
    return matchesCapacity && matchesAvailability
  })

  const myBookings = bookings.filter((booking) => booking.userId === user?.id)

  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, any> = {
      WiFi: Wifi,
      Projector: Monitor,
      "TV Screen": Monitor,
      "Video Conference": Monitor,
      "Coffee Machine": Coffee,
      Whiteboard: Monitor,
    }
    const Icon = icons[amenity] || Monitor
    return <Icon className="h-3 w-3" />
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Label>{t("capacity")}</Label>
          <Select value={filterCapacity} onValueChange={setFilterCapacity}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Capacities</SelectItem>
              <SelectItem value="4">4+ people</SelectItem>
              <SelectItem value="6">6+ people</SelectItem>
              <SelectItem value="12">12+ people</SelectItem>
              <SelectItem value="20">20+ people</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <Label>Availability</Label>
          <Select value={filterAvailability} onValueChange={setFilterAvailability}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rooms</SelectItem>
              <SelectItem value="true">{t("available")}</SelectItem>
              <SelectItem value="false">{t("booked")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => (
          <motion.div key={room.id} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card className={`h-full ${!room.available ? "opacity-60" : ""}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <DoorOpen className="h-5 w-5 text-emerald-500" />
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                  </div>
                  <Badge variant={room.available ? "default" : "secondary"}>
                    {room.available ? t("available") : t("booked")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>
                      {t("capacity")}: {room.capacity} people
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{room.location}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline" className="text-xs">
                      {getAmenityIcon(amenity)}
                      <span className="ml-1">{amenity}</span>
                    </Badge>
                  ))}
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" disabled={!room.available} onClick={() => setSelectedRoom(room)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t("bookRoom")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {t("bookRoom")}: {room.name}
                      </DialogTitle>
                    </DialogHeader>
                    <BookingForm room={room} onClose={() => setSelectedRoom(null)} />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* My Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>{t("myBookings")}</CardTitle>
        </CardHeader>
        <CardContent>
          {myBookings.length > 0 ? (
            <div className="space-y-3">
              {myBookings.map((booking) => {
                const room = mockRooms.find((r) => r.id === booking.roomId)
                return (
                  <motion.div
                    key={booking.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{booking.title}</h4>
                        <Badge
                          variant={
                            booking.status === "confirmed"
                              ? "default"
                              : booking.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DoorOpen className="h-3 w-3" />
                          {room?.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(booking.startTime)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {booking.attendees.length} attendees
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <DoorOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No bookings yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function BookingForm({ room, onClose }: { room: Room; onClose: () => void }) {
  const { t } = useTranslation()
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle booking submission
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">{t("eventTitle")}</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Meeting title" />
      </div>
      <div>
        <Label htmlFor="date">{t("date")}</Label>
        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startTime">{t("startTime")}</Label>
          <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="endTime">{t("endTime")}</Label>
          <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>
      </div>
      <div>
        <Label htmlFor="attendees">{t("attendees")}</Label>
        <Input id="attendees" placeholder="Add attendees..." />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button type="submit">
          <Check className="h-4 w-4 mr-2" />
          {t("bookRoom")}
        </Button>
      </div>
    </form>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock } from "lucide-react"

const mockCoachingSchedule = [
  {
    id: 1,
    topic: "React Hooks Deep Dive",
    mentor: "Sarah Lee",
    mentorAvatar: "/avatars/sarah.png",
    date: "2024-08-20T10:00:00",
  },
  {
    id: 2,
    topic: "Presentation Skills Workshop",
    mentor: "David Chen",
    mentorAvatar: "/avatars/david.png",
    date: "2024-08-22T14:30:00",
  },
]

export function CoachingSchedule() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Coaching / Mentoring</CardTitle>
        <CardDescription>Your upcoming sessions.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {mockCoachingSchedule.map((session) => (
            <li key={session.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted">
              <Avatar>
                <AvatarImage src={session.mentorAvatar} alt={session.mentor} />
                <AvatarFallback>{session.mentor.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <p className="font-semibold">{session.topic}</p>
                <p className="text-sm text-muted-foreground">with {session.mentor}</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4"/>
                    {new Date(session.date).toLocaleDateString()}
                </div>
                 <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4"/>
                    {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

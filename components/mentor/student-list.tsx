"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const mockStudents = [
  {
    id: "USR-001",
    name: "Alice Johnson",
    avatar: "/avatars/01.png",
    team: "Micro-SaaS Builders",
    overallProgress: 75,
  },
  {
    id: "USR-002",
    name: "Bob Williams",
    avatar: "/avatars/02.png",
    team: "Virtual Sales",
    overallProgress: 60,
  },
  {
    id: "USR-003",
    name: "Charlie Brown",
    avatar: "/avatars/03.png",
    team: "S17 Dev Team",
    overallProgress: 90,
  },
    {
    id: "USR-004",
    name: "Diana Miller",
    avatar: "/avatars/04.png",
    team: "Micro-SaaS Builders",
    overallProgress: 45,
  },
]

export function StudentList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentoring Students</CardTitle>
        <CardDescription>List of students you are currently mentoring.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {mockStudents.map((student) => (
            <li key={student.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted">
              <Avatar>
                <AvatarImage src={student.avatar} alt={student.name} />
                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{student.name}</p>
                <p className="text-sm text-muted-foreground">{student.team}</p>
                <Progress value={student.overallProgress} className="mt-1 h-2" />
              </div>
              <Button variant="outline" size="sm">Evaluate</Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

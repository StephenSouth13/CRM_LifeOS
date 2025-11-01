"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, MessageSquare, Smile } from "lucide-react"

const mockTeams = [
  {
    id: "TEAM-MSB",
    name: "Micro-SaaS Builders",
    tasksCompleted: 48,
    averageMorale: 8.2,
    recentActivity: "Completed 'User Authentication' feature.",
  },
  {
    id: "TEAM-VS",
    name: "Virtual Sales",
    tasksCompleted: 32,
    averageMorale: 7.5,
    recentActivity: "User testing feedback session.",
  },
  {
    id: "TEAM-S17",
    name: "S17 Dev Team",
    tasksCompleted: 64,
    averageMorale: 9.1,
    recentActivity: "Deployed new build to staging.",
  },
]

export function TeamProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Progress</CardTitle>
        <CardDescription>Overview of team performance and progress.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockTeams.map((team) => (
          <div key={team.id} className="p-3 rounded-lg border bg-muted/20">
            <p className="font-semibold text-md mb-2">{team.name}</p>
            <div className="grid grid-cols-3 gap-2 text-sm text-center">
                <div className="p-2 rounded-md bg-background">
                    <CheckCircle2 className="h-5 w-5 mx-auto text-green-500" />
                    <p className="mt-1 font-bold">{team.tasksCompleted}</p>
                    <p className="text-xs text-muted-foreground">Tasks Done</p>
                </div>
                <div className="p-2 rounded-md bg-background">
                    <Smile className="h-5 w-5 mx-auto text-yellow-500" />
                    <p className="mt-1 font-bold">{team.averageMorale}/10</p>
                    <p className="text-xs text-muted-foreground">Avg. Morale</p>
                </div>
                <div className="p-2 rounded-md bg-background col-span-3 flex items-center space-x-2 text-left">
                    <MessageSquare className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground italic">{team.recentActivity}</p>
                </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Zap } from "lucide-react"

const mockSuggestions = [
    {
        id: 1,
        title: "Fix login bug (#T-123)",
        reason: "High priority - blocks user testing.",
        priority: "Urgent"
    },
    {
        id: 2,
        title: "Review PR from Charlie",
        reason: "Dependency for an upcoming feature.",
        priority: "High"
    },
    {
        id: 3,
        title: "Update documentation for API endpoints",
        reason: "Due this Friday.",
        priority: "Medium"
    },
]

export function AiAssistant() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
            <CardTitle>AI Task Assistant</CardTitle>
            <CardDescription>Your AI-powered priority list.</CardDescription>
        </div>
        <Lightbulb className="h-6 w-6 text-yellow-500" />
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {mockSuggestions.map((task) => (
            <li key={task.id} className="flex items-start p-2 rounded-lg bg-muted/30">
              <Zap className={`h-5 w-5 mr-3 mt-0.5 ${task.priority === 'Urgent' ? 'text-red-500' : task.priority === 'High' ? 'text-orange-500' : 'text-blue-500'}`} />
              <div className="flex-1">
                <p className="font-semibold text-sm">{task.title}</p>
                <p className="text-xs text-muted-foreground">{task.reason}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

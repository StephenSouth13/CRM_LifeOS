"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

const mockAiFeedback = [
  {
    id: 1,
    suggestion: "Your React components are functional, but could be more reusable. Consider using Higher-Order Components (HOCs) or custom hooks to extract shared logic.",
    area: "React & Next.js",
  },
  {
    id: 2,
    suggestion: "To improve your Public Speaking, try practicing short, impromptu speeches on familiar topics. This can help build confidence and fluency.",
    area: "Public Speaking",
  },
    {
    id: 3,
    suggestion: "Great work on meeting your code quality targets! To take it a step further, explore setting up automated code analysis tools like SonarQube in your next project.",
    area: "Code Quality",
  },
]

export function AiFeedback() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Feedback</CardTitle>
        <CardDescription>Personalized suggestions for skill improvement.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {mockAiFeedback.map((feedback) => (
            <li key={feedback.id} className="flex items-start space-x-3">
              <Lightbulb className="h-5 w-5 mt-1 text-yellow-400" />
              <div>
                <p className="font-medium text-sm">{feedback.area}</p>
                <p className="text-muted-foreground text-sm">{feedback.suggestion}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

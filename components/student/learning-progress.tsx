"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const mockLearningProgress = [
  { id: 1, skill: "React & Next.js", progress: 75, level: "L2" },
  { id: 2, skill: "TypeScript", progress: 60, level: "L2" },
  { id: 3, skill: "Project Management", progress: 85, level: "L3" },
  { id: 4, skill: "Public Speaking", progress: 40, level: "L1" },
]

export function LearningProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
        <CardDescription>Your current skill development progress.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockLearningProgress.map((item) => (
            <div key={item.id}>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium">
                  {item.skill} <span className="text-xs text-muted-foreground">({item.level})</span>
                </p>
                <span className="text-sm text-muted-foreground">{item.progress}%</span>
              </div>
              <Progress value={item.progress} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

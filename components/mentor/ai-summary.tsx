"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot } from "lucide-react"

export function AiSummary() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
            <CardTitle>AI Mentoring Summary</CardTitle>
            <CardDescription>Key insights from your mentoring activities.</CardDescription>
        </div>
        <Bot className="h-6 w-6 text-primary" />
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start">
            <span className="font-bold text-primary mr-2">●</span>
            <div>
                <span className="font-semibold text-foreground">Common Challenge:</span> Time management and task prioritization are frequent topics across all teams.
            </div>
          </li>
          <li className="flex items-start">
            <span className="font-bold text-primary mr-2">●</span>
            <div>
                <span className="font-semibold text-foreground">Positive Trend:</span> Team morale has seen a 15% average increase over the last month, especially in the S17 Dev Team.
            </div>
          </li>
          <li className="flex items-start">
            <span className="font-bold text-primary mr-2">●</span>
            <div>
                <span className="font-semibold text-foreground">Actionable Suggestion:</span> Consider hosting a workshop on Agile methodologies to improve team velocity for Micro-SaaS Builders.
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}

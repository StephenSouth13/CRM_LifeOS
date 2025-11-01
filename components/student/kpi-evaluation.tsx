"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const mockKpiData = {
  overallScore: 88,
  kpis: [
    { id: 1, name: "Code Quality", score: 92, target: 90 },
    { id: 2, name: "Task Completion Rate", score: 85, target: 80 },
    { id: 3, name: "Team Collaboration", score: 90, target: 85 },
    { id: 4, name: "Proactiveness", score: 85, target: 90 },
  ],
}

export function KpiEvaluation() {
  const getScoreColor = (score: number, target: number) => {
    if (score >= target) return "bg-green-100 text-green-800"
    if (score >= target * 0.9) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>KPI & Internship Evaluation</CardTitle>
        <CardDescription>Your performance scores.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">Overall Score</p>
          <p className="text-4xl font-bold">{mockKpiData.overallScore}</p>
        </div>
        <ul className="space-y-2">
          {mockKpiData.kpis.map((kpi) => (
            <li key={kpi.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted">
              <span className="font-medium">{kpi.name}</span>
              <Badge className={getScoreColor(kpi.score, kpi.target)}>
                {kpi.score} / {kpi.target}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

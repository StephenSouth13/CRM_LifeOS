"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const mockKpis = {
    tasksCompleted: { value: 35, target: 50, label: "Tasks Completed" },
    featurePoints: { value: 28, target: 40, label: "Feature Points Delivered" },
    codeReviews: { value: 45, target: 60, label: "Code Reviews" },
}

const mockOkr = {
    objective: "Enhance User Engagement by 20%",
    keyResults: [
        { id: "KR1", text: "Launch 3 new interactive features", progress: 66 },
        { id: "KR2", text: "Reduce page load time by 300ms", progress: 80 },
        { id: "KR3", text: "Increase session duration by 1 minute", progress: 45 },
    ]
}

export function KpiOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal KPI & OKR</CardTitle>
        <CardDescription>Your current performance indicators and objectives.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <h3 className="font-semibold text-md mb-3">This Quarter's KPIs</h3>
            <div className="space-y-3">
                {Object.values(mockKpis).map(kpi => (
                    <div key={kpi.label}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{kpi.label}</span>
                            <span>{kpi.value} / {kpi.target}</span>
                        </div>
                        <Progress value={(kpi.value / kpi.target) * 100} />
                    </div>
                ))}
            </div>
        </div>
        <div>
            <h3 className="font-semibold text-md mb-2">Objective: <span className="text-primary">{mockOkr.objective}</span></h3>
            <div className="space-y-3">
                {mockOkr.keyResults.map(kr => (
                     <div key={kr.id}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{kr.text}</span>
                            <span>{kr.progress}%</span>
                        </div>
                        <Progress value={kr.progress} />
                    </div>
                ))}
            </div>
        </div>
      </CardContent>
    </Card>
  )
}

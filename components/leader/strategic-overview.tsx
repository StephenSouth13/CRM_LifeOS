"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, GanttChartSquare, ShieldAlert } from "lucide-react"

const mockData = {
    overallKPI: {
        revenue: { value: "$1.2M", change: "+15%", trend: "up" },
        customerSatisfaction: { value: "92%", change: "-1%", trend: "down" },
        projectOnTime: { value: "85%", change: "+5%", trend: "up" },
    },
    projectProgress: 76,
    riskLevel: "Medium",
}

export function StrategicOverview() {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Strategic Dashboard</CardTitle>
        <CardDescription>High-level view of company KPIs, project progress, and risks.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">{mockData.overallKPI.revenue.value}</p>
                <p className="text-xs text-muted-foreground flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" /> {mockData.overallKPI.revenue.change} vs last quarter
                </p>
            </div>
            <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                <p className="text-2xl font-bold">{mockData.overallKPI.customerSatisfaction.value}</p>
                <p className="text-xs text-muted-foreground flex items-center text-red-600">
                    <TrendingDown className="h-4 w-4 mr-1" /> {mockData.overallKPI.customerSatisfaction.change} vs last quarter
                </p>
            </div>
            <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Projects On Time</p>
                <p className="text-2xl font-bold">{mockData.overallKPI.projectOnTime.value}</p>
                <p className="text-xs text-muted-foreground flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" /> {mockData.overallKPI.projectOnTime.change} vs last month
                </p>
            </div>
        </div>

        {/* Project Progress */}
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <GanttChartSquare className="h-5 w-5 mr-2 text-primary" />
                    <h4 className="font-semibold">Overall Project Progress</h4>
                </div>
                <span className="font-bold text-lg">{mockData.projectProgress}%</span>
            </div>
            <Progress value={mockData.projectProgress} />
        </div>

        {/* Risk Level */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
             <div className="flex items-center">
                <ShieldAlert className="h-5 w-5 mr-2 text-orange-500" />
                <h4 className="font-semibold">System-wide Risk Level</h4>
            </div>
            <span className="font-semibold text-orange-500 bg-orange-100 dark:bg-orange-900/50 px-2 py-1 rounded-full text-sm">{mockData.riskLevel}</span>
        </div>
      </CardContent>
    </Card>
  )
}

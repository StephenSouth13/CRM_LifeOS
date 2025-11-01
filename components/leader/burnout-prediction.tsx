"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertTriangle, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const mockBurnoutRisks = [
  {
    id: "USR-001",
    name: "John Krasinski",
    avatar: "/avatars/06.png",
    riskLevel: "High",
    factors: ["High overtime hours", "7 overdue tasks"],
  },
  {
    id: "USR-002",
    name: "Fiona Clark",
    avatar: "/avatars/07.png",
    riskLevel: "Medium",
    factors: ["Increased after-hours commits", "Low task completion rate"],
  },
  {
    id: "USR-003",
    name: "George Wilson",
    avatar: "/avatars/08.png",
    riskLevel: "Medium",
    factors: ["Consistently high task load"],
  },
];

export function BurnoutPrediction() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>AI Burnout Prediction</CardTitle>
            <CardDescription>Employees at risk of burnout, identified by AI.</CardDescription>
          </div>
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {mockBurnoutRisks.map((employee) => (
            <li key={employee.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted/50">
              <Avatar className="h-10 w-10">
                <AvatarImage src={employee.avatar} alt={employee.name} />
                <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{employee.name}</p>
                  <Badge 
                    variant={employee.riskLevel === 'High' ? 'destructive' : 'secondary'}
                    className={employee.riskLevel === 'Medium' ? 'text-amber-600 border-amber-500/50' : ''}
                  >
                    {employee.riskLevel} Risk
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {employee.factors.join(" / ")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

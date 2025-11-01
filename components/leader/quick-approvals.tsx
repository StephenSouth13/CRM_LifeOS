"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, FileText, Calendar, DollarSign } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const mockApprovals = [
    {
        id: "REQ-001",
        type: "Leave Request",
        icon: Calendar,
        requester: "Emily Blunt",
        details: "Vacation: Nov 15 - Nov 22",
    },
    {
        id: "REQ-002",
        type: "Budget Proposal",
        icon: DollarSign,
        requester: "Charlie Brown",
        details: "Q4 Marketing Campaign - $15,000",
    },
    {
        id: "REQ-003",
        type: "Project Milestone",
        icon: FileText,
        requester: "Diana Miller",
        details: "Alpha Release Candidate 2",
    },
    {
        id: "REQ-004",
        type: "Leave Request",
        icon: Calendar,
        requester: "Bob Williams",
        details: "Sick Leave: Nov 5",
    }
]

export function QuickApprovals() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Approvals</CardTitle>
        <CardDescription>Pending requests that need your decision.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-60">
            <ul className="space-y-3">
            {mockApprovals.map((req) => (
                <li key={req.id} className="flex items-center space-x-3 p-2 rounded-lg border bg-background">
                    <req.icon className={`h-5 w-5 text-muted-foreground`} />
                    <div className="flex-1">
                        <p className="font-semibold text-sm">{req.type}</p>
                        <p className="text-xs text-muted-foreground">From: {req.requester} - {req.details}</p>
                    </div>
                    <div className="flex space-x-1.5">
                        <Button variant="outline" size="icon" className="h-7 w-7 text-green-600 hover:text-green-600 hover:bg-green-100 dark:hover:bg-green-900/50">
                            <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-7 w-7 text-red-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </li>
            ))}
            </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

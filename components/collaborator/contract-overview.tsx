"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, FileText } from "lucide-react"

const mockContract = {
    id: "CTR-2024-07B",
    projectName: "Q4 Marketing Asset Creation",
    endDate: "Dec 31, 2024",
    paymentStatus: "Paid up to Oct",
    tasks: [
        { id: "TSK-C01", title: "Design 5 social media graphics", status: "Completed" },
        { id: "TSK-C02", title: "Write blog post on new feature", status: "In Progress" },
        { id: "TSK-C03", title: "Record short video tutorial", status: "Pending" },
    ]
}

export function ContractOverview() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
            <div>
                <CardTitle>Contract & Ad-hoc Tasks</CardTitle>
                <CardDescription>Details of your current project contract.</CardDescription>
            </div>
            <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 rounded-lg border">
            <div>
                <p className="text-xs text-muted-foreground">Contract ID</p>
                <p className="font-mono text-sm">{mockContract.id}</p>
            </div>
            <div>
                <p className="text-xs text-muted-foreground">Project</p>
                <p className="font-semibold text-sm">{mockContract.projectName}</p>
            </div>
            <div>
                <p className="text-xs text-muted-foreground">End Date</p>
                <p className="font-semibold text-sm">{mockContract.endDate}</p>
            </div>
        </div>
        <div>
            <h4 className="font-semibold mb-2">Assigned Tasks</h4>
            <ul className="space-y-2">
                {mockContract.tasks.map(task => (
                    <li key={task.id} className="flex items-center text-sm">
                        {task.status === "Completed" ? 
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> : 
                            <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                        }
                        <span className={`flex-1 ${task.status === 'Completed' ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                        </span>
                        <Badge variant={task.status === "Completed" ? "outline" : "secondary"} className="ml-auto">
                            {task.status}
                        </Badge>
                    </li>
                ))}
            </ul>
        </div>
      </CardContent>
    </Card>
  )
}

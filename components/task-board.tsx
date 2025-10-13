"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/hooks/use-translation"
import { Calendar, User } from "lucide-react"

const mockTasks = {
  todo: [
    {
      id: 2,
      title: "Review pull requests",
      priority: "medium",
      dueDate: "2025-01-14",
      assignee: "Jane Smith",
    },
    {
      id: 3,
      title: "Prepare monthly report",
      priority: "high",
      dueDate: "2025-01-16",
      assignee: "John Doe",
    },
  ],
  inProgress: [
    {
      id: 1,
      title: "Update project documentation",
      priority: "high",
      dueDate: "2025-01-15",
      assignee: "John Doe",
    },
    {
      id: 5,
      title: "Code refactoring",
      priority: "medium",
      dueDate: "2025-01-18",
      assignee: "John Doe",
    },
  ],
  completed: [
    {
      id: 4,
      title: "Team meeting preparation",
      priority: "low",
      dueDate: "2025-01-13",
      assignee: "Jane Smith",
    },
  ],
}

export function TaskBoard() {
  const { t } = useTranslation()

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: "bg-destructive/10 text-destructive border-destructive/20",
      medium: "bg-accent/10 text-accent-foreground border-accent/20",
      low: "bg-muted text-muted-foreground border-muted",
    }
    return colors[priority] || colors.medium
  }

  const columns = [
    { key: "todo", title: t("todo"), tasks: mockTasks.todo },
    { key: "inProgress", title: t("inProgress"), tasks: mockTasks.inProgress },
    { key: "completed", title: t("completed"), tasks: mockTasks.completed },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {columns.map((column) => (
        <Card key={column.key}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{column.title}</CardTitle>
              <Badge variant="secondary">{column.tasks.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  className="cursor-pointer rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent/50"
                >
                  <h4 className="mb-2 font-medium">{task.title}</h4>
                  <div className="space-y-2">
                    <Badge className={getPriorityColor(task.priority)} variant="outline">
                      {t(task.priority)}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {task.assignee}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

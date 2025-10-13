"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/hooks/use-translation"
import { Calendar, MoreVertical, User } from "lucide-react"
import { motion } from "framer-motion"

const mockTasks = [
  {
    id: 1,
    title: "Update project documentation",
    description: "Review and update all project documentation for Q1",
    priority: "high",
    status: "inProgress",
    dueDate: "2025-01-15",
    assignee: "John Doe",
  },
  {
    id: 2,
    title: "Review pull requests",
    description: "Review pending pull requests from team members",
    priority: "medium",
    status: "todo",
    dueDate: "2025-01-14",
    assignee: "Jane Smith",
  },
  {
    id: 3,
    title: "Prepare monthly report",
    description: "Compile and prepare monthly performance report",
    priority: "high",
    status: "todo",
    dueDate: "2025-01-16",
    assignee: "John Doe",
  },
  {
    id: 4,
    title: "Team meeting preparation",
    description: "Prepare agenda and materials for weekly team meeting",
    priority: "low",
    status: "completed",
    dueDate: "2025-01-13",
    assignee: "Jane Smith",
  },
  {
    id: 5,
    title: "Code refactoring",
    description: "Refactor authentication module for better performance",
    priority: "medium",
    status: "inProgress",
    dueDate: "2025-01-18",
    assignee: "John Doe",
  },
]

export function TaskList() {
  const { t } = useTranslation()

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: "bg-destructive/10 text-destructive border-destructive/20",
      medium: "bg-accent/10 text-accent-foreground border-accent/20",
      low: "bg-muted text-muted-foreground border-muted",
    }
    return colors[priority] || colors.medium
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, "default" | "secondary" | "outline"> = {
      todo: "outline",
      inProgress: "secondary",
      completed: "default",
    }
    return colors[status] || "outline"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("myTasks")}</CardTitle>
        <CardDescription>Manage your tasks and track progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group rounded-lg border border-border p-4 transition-colors hover:bg-accent/50"
            >
              <div className="flex items-start gap-4">
                <Checkbox id={`task-${task.id}`} checked={task.status === "completed"} className="mt-1" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor={`task-${task.id}`}
                        className={`cursor-pointer font-medium ${
                          task.status === "completed" ? "line-through opacity-60" : ""
                        }`}
                      >
                        {task.title}
                      </label>
                      <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>{t("viewDetails")}</DropdownMenuItem>
                        <DropdownMenuItem>{t("edit")}</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">{t("deleteTask")}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={getPriorityColor(task.priority)}>{t(task.priority)}</Badge>
                    <Badge variant={getStatusColor(task.status)}>{t(task.status)}</Badge>
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
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

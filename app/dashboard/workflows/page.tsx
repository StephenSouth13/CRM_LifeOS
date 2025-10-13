"use client"

import { useState } from "react"
import { useTranslation } from "@/hooks/use-translation"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Play, Pause, Edit, Trash2, GitBranch, Zap, Search } from "lucide-react"
import { motion } from "framer-motion"

export default function WorkflowsPage() {
  const { t } = useTranslation()
  const { user } = useAppStore()
  const [searchQuery, setSearchQuery] = useState("")

  // Demo workflows
  const workflows = [
    {
      id: "1",
      name: "Auto Check-in Reminder",
      description: "Send reminder when staff forgets to check-in",
      enabled: true,
      nodes: 5,
      runs: 142,
      lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "2",
      name: "Meeting Summary Generator",
      description: "Auto-generate meeting notes and action items",
      enabled: true,
      nodes: 7,
      runs: 89,
      lastRun: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: "3",
      name: "Task Completion Notification",
      description: "Notify team when tasks are completed",
      enabled: false,
      nodes: 4,
      runs: 56,
      lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ]

  const filteredWorkflows = workflows.filter((w) => w.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t("workflows")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Automate your workflows with triggers, actions, and AI</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {t("createWorkflow")}
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Workflows Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredWorkflows.map((workflow, index) => (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <GitBranch className="h-5 w-5 text-white" />
                  </div>
                  <Badge variant={workflow.enabled ? "default" : "secondary"}>
                    {workflow.enabled ? t("workflowEnabled") : t("workflowDisabled")}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <h3 className="font-semibold mb-2">{workflow.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{workflow.description}</p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  <span>{workflow.nodes} nodes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Play className="h-3 w-3" />
                  <span>{workflow.runs} runs</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" className="flex-1 gap-2">
                  <Play className="h-3 w-3" />
                  {t("runWorkflow")}
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                  {workflow.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredWorkflows.length === 0 && (
        <Card className="p-12 text-center">
          <GitBranch className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No workflows found</h3>
          <p className="text-sm text-muted-foreground mb-4">Create your first workflow to automate your tasks</p>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t("createWorkflow")}
          </Button>
        </Card>
      )}
    </div>
  )
}

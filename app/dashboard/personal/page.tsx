"use client"

import { useState } from "react"
import { useTranslation } from "@/hooks/use-translation"
import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, TrendingUp, Award, Flame, Clock, BarChart3, Brain } from "lucide-react"
import { motion } from "framer-motion"

export default function PersonalHubPage() {
  const { t } = useTranslation()
  const { user } = useAppStore()
  const [focusMode, setFocusMode] = useState(false)

  const stats = [
    { label: "Tasks Completed", value: 47, total: 60, icon: Target, color: "text-blue-500" },
    { label: "Working Hours", value: 38.5, total: 40, icon: Clock, color: "text-green-500" },
    { label: "Productivity Score", value: 87, total: 100, icon: TrendingUp, color: "text-purple-500" },
    { label: "Current Streak", value: 12, total: 30, icon: Flame, color: "text-orange-500" },
  ]

  const goals = [
    { id: "1", title: "Complete 50 tasks this month", progress: 78, deadline: "Dec 31" },
    { id: "2", title: "Maintain 90% attendance", progress: 92, deadline: "Dec 31" },
    { id: "3", title: "Learn new skill", progress: 45, deadline: "Jan 15" },
  ]

  const achievements = [
    { id: "1", title: "Early Bird", description: "Check-in before 8 AM for 7 days", unlocked: true },
    { id: "2", title: "Task Master", description: "Complete 100 tasks", unlocked: true },
    { id: "3", title: "Team Player", description: "Help 10 team members", unlocked: false },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t("personalHub")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Track your productivity, habits, and personal growth</p>
        </div>
        <Button variant={focusMode ? "default" : "outline"} onClick={() => setFocusMode(!focusMode)} className="gap-2">
          <Brain className="h-4 w-4" />
          {t("focusMode")}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const percentage = (stat.value / stat.total) * 100
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                <Progress value={percentage} className="h-2" />
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="goals" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="goals">{t("goals")}</TabsTrigger>
          <TabsTrigger value="achievements">{t("achievements")}</TabsTrigger>
          <TabsTrigger value="analytics">{t("selfAnalytics")}</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-4">
          {goals.map((goal) => (
            <Card key={goal.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground">Deadline: {goal.deadline}</p>
                </div>
                <span className="text-sm font-medium">{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`p-6 ${achievement.unlocked ? "" : "opacity-50"}`}>
                <div className="flex items-start gap-4">
                  <div
                    className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                      achievement.unlocked ? "bg-gradient-to-br from-yellow-500 to-orange-500" : "bg-accent"
                    }`}
                  >
                    <Award className={`h-6 w-6 ${achievement.unlocked ? "text-white" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">{t("selfAnalytics")}</h2>
            </div>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Analytics chart will be displayed here
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useAppStore } from "@/lib/store"
import { useTranslation } from "@/hooks/use-translation"
import { RoleBadge } from "@/components/role-badge"
import { LearningProgress } from "@/components/student/learning-progress"
import { CoachingSchedule } from "@/components/student/coaching-schedule"
import { KpiEvaluation } from "@/components/student/kpi-evaluation"
import { ProjectList } from "@/components/student/project-list"
import { AiFeedback } from "@/components/student/ai-feedback"

export default function StudentDashboardPage() {
  const { t } = useTranslation()
  const { user } = useAppStore()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            {t("welcome")}, {user?.name}!
          </h1>
          <p className="text-muted-foreground">Your student dashboard</p>
        </div>
        {user && <RoleBadge role={user.role} />}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 space-y-4">
            <LearningProgress />
            <ProjectList />
        </div>
        <div className="lg:col-span-3 space-y-4">
            <CoachingSchedule />
            <KpiEvaluation />
            <AiFeedback />
        </div>
      </div>
    </div>
  )
}

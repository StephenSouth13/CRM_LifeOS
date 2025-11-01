"use client"

import { useAppStore } from "@/lib/store"
import { useTranslation } from "@/hooks/use-translation"
import { RoleBadge } from "@/components/role-badge"
import { ContractOverview } from "@/components/collaborator/contract-overview"
import { ScheduleReporting } from "@/components/collaborator/schedule-reporting"
import { WorkSubmission } from "@/components/collaborator/work-submission"
import { AiSummaryGenerator } from "@/components/collaborator/ai-summary-generator"

export default function CollaboratorDashboardPage() {
  const { t } = useTranslation()
  const { user } = useAppStore()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            {t("welcome")}, {user?.name}!
          </h1>
          <p className="text-muted-foreground">Your dashboard for project-based collaboration.</p>
        </div>
        {user && <RoleBadge role={user.role} />}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Main Column */}
        <div className="lg:col-span-3 space-y-4">
            <ContractOverview />
            <WorkSubmission />
        </div>

        {/* Side Column */}
        <div className="lg:col-span-2 space-y-4">
            <ScheduleReporting />
            <AiSummaryGenerator />
        </div>
      </div>
    </div>
  )
}

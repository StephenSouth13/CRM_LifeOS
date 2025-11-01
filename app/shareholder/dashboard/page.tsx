"use client"

import { useAppStore } from "@/lib/store"
import { useTranslation } from "@/hooks/use-translation"
import { RoleBadge } from "@/components/role-badge"
import { FinancialDashboard } from "@/components/shareholder/financial-dashboard"
import { ProjectUpdates } from "@/components/shareholder/project-updates"
import { MeetingsVoting } from "@/components/shareholder/meetings-voting"
import { AiInvestmentTrends } from "@/components/shareholder/ai-investment-trends"

export default function ShareholderDashboardPage() {
  const { t } = useTranslation()
  const { user } = useAppStore()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            {t("welcome")}, {user?.name}!
          </h1>
          <p className="text-muted-foreground">Your strategic overview of the company's performance.</p>
        </div>
        {user && <RoleBadge role={user.role} />}
      </div>
      <div className="space-y-4">
        <FinancialDashboard />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3">
                <ProjectUpdates />
            </div>
            <div className="lg:col-span-2">
                <MeetingsVoting />
            </div>
        </div>
        <AiInvestmentTrends />
      </div>
    </div>
  )
}

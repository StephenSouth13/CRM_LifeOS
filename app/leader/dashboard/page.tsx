"use client"

import { useAppStore } from "@/lib/store"
import { useTranslation } from "@/hooks/use-translation"
import { RoleBadge } from "@/components/role-badge"
import { StrategicOverview } from "@/components/leader/strategic-overview"
import { TalentMap } from "@/components/leader/talent-map"
import { BurnoutPrediction } from "@/components/leader/burnout-prediction"
import { QuickApprovals } from "@/components/leader/quick-approvals"

export default function LeaderDashboardPage() {
  const { t } = useTranslation()
  const { user } = useAppStore()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            {t("welcome")}, {user?.name}!
          </h1>
          <p className="text-muted-foreground">Strategic overview of the entire system.</p>
        </div>
        {user && <RoleBadge role={user.role} />}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-4">
          <StrategicOverview />
          <TalentMap />
        </div>

        {/* Side Column */}
        <div className="lg:col-span-1 space-y-4">
          <BurnoutPrediction />
          <QuickApprovals />
        </div>
      </div>
    </div>
  )
}

"use client"

import { useAppStore } from "@/lib/store"
import { useTranslation } from "@/hooks/use-translation"
import { RoleBadge } from "@/components/role-badge"
import { SalesKpi } from "@/components/seller/sales-kpi"
import { MiniCrm } from "@/components/seller/mini-crm"
import { AiLeads } from "@/components/seller/ai-leads"
import { CampaignDashboard } from "@/components/seller/campaign-dashboard"

export default function SellerDashboardPage() {
  const { t } = useTranslation()
  const { user } = useAppStore()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            {t("welcome")}, {user?.name}!
          </h1>
          <p className="text-muted-foreground">Your sales and customer management hub.</p>
        </div>
        {user && <RoleBadge role={user.role} />}
      </div>
      <div className="space-y-4">
        <SalesKpi />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="lg:col-span-4">
                <MiniCrm />
            </div>
             <div className="lg:col-span-3">
                <AiLeads />
            </div>
        </div>
        <CampaignDashboard />
      </div>
    </div>
  )
}

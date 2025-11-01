"use client"

import { useAppStore } from "@/lib/store"
import { useTranslation } from "@/hooks/use-translation"
import { RoleBadge } from "@/components/role-badge"
import { ProfileHistory } from "@/components/customer/profile-history"
import { OrderStatus } from "@/components/customer/order-status"
import { FeedbackPortal } from "@/components/customer/feedback-portal"
import { AiChatbot } from "@/components/customer/ai-chatbot"

export default function CustomerDashboardPage() {
  const { t } = useTranslation()
  const { user } = useAppStore()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            {t("welcome")}, {user?.name}!
          </h1>
          <p className="text-muted-foreground">Your personal customer portal.</p>
        </div>
        {user && <RoleBadge role={user.role} />}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-4">
            <OrderStatus />
            <ProfileHistory />
            <FeedbackPortal />
        </div>

        {/* Side Column */}
        <div className="lg:col-span-1 space-y-4">
           <AiChatbot />
        </div>
      </div>
    </div>
  )
}

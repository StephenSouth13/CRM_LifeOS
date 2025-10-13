import { AdminStats } from "@/components/admin-stats"
import { UserTable } from "@/components/user-table"
import { SystemAnalytics } from "@/components/system-analytics"

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
        <p className="text-muted-foreground">Manage users and system settings</p>
      </div>

      <AdminStats />

      <UserTable />

      <SystemAnalytics />
    </div>
  )
}

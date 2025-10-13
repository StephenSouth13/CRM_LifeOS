"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"
import { useAppStore } from "@/lib/store"
import { RoleBadge } from "@/components/role-badge"
import {
  LayoutDashboard,
  Clock,
  CheckSquare,
  Shield,
  Settings,
  Calendar,
  FileText,
  DoorOpen,
  Music,
  Users,
  BarChart3,
  Briefcase,
  FileCheck,
  GitBranch,
  Brain,
  User,
} from "lucide-react"

export function DashboardNav() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const { user } = useAppStore()

  const getNavItems = () => {
    const baseItems = [
      {
        href: "/dashboard",
        icon: LayoutDashboard,
        key: "dashboard" as const,
        roles: ["owner", "admin", "leader", "staff"],
      },
      {
        href: "/dashboard/attendance",
        icon: Clock,
        key: "attendance" as const,
        roles: ["owner", "admin", "leader", "staff"],
      },
      {
        href: "/dashboard/tasks",
        icon: CheckSquare,
        key: "tasks" as const,
        roles: ["owner", "admin", "leader", "staff"],
      },
      {
        href: "/dashboard/calendar",
        icon: Calendar,
        key: "calendar" as const,
        roles: ["owner", "admin", "leader", "staff"],
      },
      { href: "/dashboard/notes", icon: FileText, key: "notes" as const, roles: ["owner", "admin", "leader", "staff"] },
      { href: "/dashboard/rooms", icon: DoorOpen, key: "rooms" as const, roles: ["owner", "admin", "leader", "staff"] },
    ]

    // Module Framework Items
    baseItems.push({
      href: "/dashboard/workflows",
      icon: GitBranch,
      key: "workflows" as const,
      roles: ["owner", "admin", "leader"],
    })

    baseItems.push({
      href: "/dashboard/ai-tools",
      icon: Brain,
      key: "aiTools" as const,
      roles: ["owner", "admin", "leader", "staff"],
    })

    baseItems.push({
      href: "/dashboard/personal",
      icon: User,
      key: "personalHub" as const,
      roles: ["owner", "admin", "leader", "staff"],
    })

    // Role-specific items
    if (user?.role === "owner") {
      baseItems.push(
        { href: "/dashboard/organizations", icon: Briefcase, key: "organizations" as const, roles: ["owner"] },
        { href: "/dashboard/billing", icon: FileCheck, key: "billing" as const, roles: ["owner"] },
      )
    }

    if (user?.role === "owner" || user?.role === "admin") {
      baseItems.push(
        { href: "/dashboard/users", icon: Users, key: "users" as const, roles: ["owner", "admin"] },
        { href: "/dashboard/reports", icon: BarChart3, key: "reports" as const, roles: ["owner", "admin"] },
      )
    }

    if (user?.role === "leader") {
      baseItems.push(
        { href: "/dashboard/team", icon: Users, key: "team" as const, roles: ["leader"] },
        { href: "/dashboard/approvals", icon: FileCheck, key: "approvals" as const, roles: ["leader"] },
      )
    }

    baseItems.push(
      { href: "/dashboard/media", icon: Music, key: "Media" as const, roles: ["owner", "admin", "leader", "staff"] },
      { href: "/dashboard/admin", icon: Shield, key: "admin" as const, roles: ["owner", "admin"] },
      {
        href: "/dashboard/settings",
        icon: Settings,
        key: "settings" as const,
        roles: ["owner", "admin", "leader", "staff"],
      },
    )

    return baseItems.filter((item) => item.roles.includes(user?.role || "staff"))
  }

  const navItems = getNavItems()

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all touch-target",
              isActive
                ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary shadow-sm"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
            )}
          >
            <Icon className={cn("h-4 w-4 flex-shrink-0 transition-transform", isActive && "scale-110")} />
            <span className="truncate">{item.key === "Media" ? item.key : t(item.key)}</span>
            {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
          </Link>
        )
      })}

      <div className="mt-4 pt-4 border-t border-border">
        <RoleBadge role={user?.role || "staff"} />
      </div>
    </nav>
  )
}

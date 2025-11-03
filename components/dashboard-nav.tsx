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
  Zap,
} from "lucide-react"
import { usePermission } from "@/hooks/use-permissions"
import type { Permission } from "@/lib/types"
import { PermissionGuard } from "@/components/permission-guard"

interface NavItem {
  href: string
  icon: any
  key: string
  permission: Permission
}

export function DashboardNav() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const { user } = useAppStore()

  const getNavItems = (): NavItem[] => {
    const items: NavItem[] = [
      {
        href: "/dashboard",
        icon: LayoutDashboard,
        key: "dashboard",
        permission: "dashboard.view",
      },
      {
        href: "/dashboard/attendance",
        icon: Clock,
        key: "attendance",
        permission: "attendance.view_self",
      },
      {
        href: "/dashboard/tasks",
        icon: CheckSquare,
        key: "tasks",
        permission: "task.view_self",
      },
      {
        href: "/dashboard/calendar",
        icon: Calendar,
        key: "calendar",
        permission: "calendar.view",
      },
      {
        href: "/dashboard/notes",
        icon: FileText,
        key: "notes",
        permission: "dashboard.view",
      },
      {
        href: "/dashboard/rooms",
        icon: DoorOpen,
        key: "rooms",
        permission: "room.view",
      },
      {
        href: "/dashboard/ai-tools",
        icon: Brain,
        key: "aiTools",
        permission: "ai.view",
      },
      {
        href: "/dashboard/personal",
        icon: User,
        key: "personalHub",
        permission: "dashboard.view",
      },
    ]

    // Admin-only items
    if (user?.role === "ADMIN" || user?.role === "BOD") {
      items.push(
        {
          href: "/dashboard/users",
          icon: Users,
          key: "users",
          permission: "user.view_all",
        },
        {
          href: "/dashboard/organizations",
          icon: Briefcase,
          key: "organizations",
          permission: "org.manage",
        },
        {
          href: "/dashboard/billing",
          icon: FileCheck,
          key: "billing",
          permission: "billing.manage",
        },
        {
          href: "/dashboard/reports",
          icon: BarChart3,
          key: "reports",
          permission: "report.view_all",
        },
      )
    }

    // Leader-specific items
    if (
      user?.role === "LEADER" ||
      user?.role === "ADMIN" ||
      user?.role === "BOD"
    ) {
      items.push({
        href: "/dashboard/evaluations",
        icon: Zap,
        key: "evaluations",
        permission: "evaluation.view_team",
      })
    }

    // Workflow and Media items
    items.push(
      {
        href: "/dashboard/workflows",
        icon: GitBranch,
        key: "workflows",
        permission: "dashboard.view",
      },
      {
        href: "/dashboard/media",
        icon: Music,
        key: "media",
        permission: "dashboard.view",
      },
    )

    // Admin panel
    if (user?.role === "ADMIN" || user?.role === "BOD") {
      items.push({
        href: "/dashboard/admin",
        icon: Shield,
        key: "admin",
        permission: "admin.manage",
      })
    }

    // Settings (available to all)
    items.push({
      href: "/dashboard/settings",
      icon: Settings,
      key: "settings",
      permission: "dashboard.view",
    })

    return items
  }

  const navItems = getNavItems()

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

        return (
          <PermissionGuardNavItem
            key={item.href}
            item={item}
            isActive={isActive}
            t={t}
            Icon={Icon}
          />
        )
      })}

      <div className="mt-4 pt-4 border-t border-border">
        <RoleBadge role={user?.role || "CUSTOMER"} />
      </div>
    </nav>
  )
}

interface PermissionGuardNavItemProps {
  item: NavItem
  isActive: boolean
  t: (key: string) => string
  Icon: any
}

function PermissionGuardNavItem({
  item,
  isActive,
  t,
  Icon,
}: PermissionGuardNavItemProps) {
  const hasPermission = usePermission(item.permission)

  if (!hasPermission) {
    return null
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
        isActive
          ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary shadow-sm"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
      )}
    >
      <Icon className={cn("h-4 w-4 flex-shrink-0 transition-transform", isActive && "scale-110")} />
      <span className="truncate">{t(item.key)}</span>
      {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
    </Link>
  )
}

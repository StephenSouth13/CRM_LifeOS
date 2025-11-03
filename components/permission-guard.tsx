"use client"

import React from "react"
import type { Permission } from "@/lib/types"
import { usePermission, useAnyPermission, useAllPermissions } from "@/hooks/use-permissions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface PermissionGuardProps {
  permission?: Permission
  permissions?: Permission[]
  requireAll?: boolean
  fallback?: React.ReactNode
  children: React.ReactNode
}

/**
 * Component to guard rendering based on permissions
 * Use `permission` for single permission check
 * Use `permissions` with `requireAll=true` for AND logic, `requireAll=false` for OR logic
 */
export function PermissionGuard({
  permission,
  permissions,
  requireAll = false,
  fallback,
  children,
}: PermissionGuardProps) {
  let hasAccess = false

  if (permission) {
    hasAccess = usePermission(permission)
  } else if (permissions) {
    hasAccess = requireAll
      ? useAllPermissions(...permissions)
      : useAnyPermission(...permissions)
  }

  if (!hasAccess) {
    return fallback || <AccessDeniedAlert />
  }

  return <>{children}</>
}

/**
 * Default access denied alert component
 */
export function AccessDeniedAlert() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        You do not have permission to access this resource.
      </AlertDescription>
    </Alert>
  )
}

/**
 * Component to conditionally render based on role check
 */
interface RoleGuardProps {
  roles: string[]
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function RoleGuard({ roles, fallback, children }: RoleGuardProps) {
  const { user } = require("@/lib/store").useAppStore()

  if (!user || !roles.includes(user.role)) {
    return fallback || <AccessDeniedAlert />
  }

  return <>{children}</>
}

/**
 * Component to show different content based on permissions
 */
interface ConditionalRenderProps {
  permission: Permission
  trueContent: React.ReactNode
  falseContent?: React.ReactNode
}

export function ConditionalRender({
  permission,
  trueContent,
  falseContent,
}: ConditionalRenderProps) {
  const hasAccess = usePermission(permission)

  return hasAccess ? <>{trueContent}</> : <>{falseContent || null}</>
}

/**
 * Tooltip that shows permission denied message
 */
interface PermissionTooltipProps {
  permission: Permission
  children: React.ReactNode
  message?: string
}

export function PermissionTooltip({
  permission,
  children,
  message = "You don't have permission for this action",
}: PermissionTooltipProps) {
  const hasAccess = usePermission(permission)

  return (
    <div
      title={!hasAccess ? message : ""}
      className={!hasAccess ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
    >
      {children}
    </div>
  )
}

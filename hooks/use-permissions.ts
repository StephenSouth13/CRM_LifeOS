"use client"

import { useAppStore } from "@/lib/store"
import {
  hasPermission,
  canManageUser,
  canAccess,
  getManagedRoles,
  canViewScope,
} from "@/lib/permissions"
import type { Role, Permission } from "@/lib/types"

/**
 * Hook to check if current user has a specific permission
 */
export function usePermission(permission: Permission): boolean {
  const { user } = useAppStore()
  if (!user) return false
  return hasPermission(user.role, permission)
}

/**
 * Hook to check multiple permissions (OR logic)
 */
export function useAnyPermission(...permissions: Permission[]): boolean {
  const { user } = useAppStore()
  if (!user) return false
  return permissions.some((p) => hasPermission(user.role, p))
}

/**
 * Hook to check if all permissions are granted (AND logic)
 */
export function useAllPermissions(...permissions: Permission[]): boolean {
  const { user } = useAppStore()
  if (!user) return false
  return permissions.every((p) => hasPermission(user.role, p))
}

/**
 * Hook to check if user can manage another user
 */
export function useCanManageUser(targetRole: Role): boolean {
  const { user } = useAppStore()
  if (!user) return false
  return canManageUser(user.role, targetRole)
}

/**
 * Hook to check access scope (all, team, self)
 */
export function useAccessScope(
  permission: Permission,
): "all" | "team" | "self" {
  const { user } = useAppStore()
  if (!user) return "self"
  return canViewScope(user.role, permission)
}

/**
 * Hook to get list of roles the current user can manage
 */
export function useManagedRoles(): Role[] {
  const { user } = useAppStore()
  if (!user) return []
  return getManagedRoles(user.role)
}

/**
 * Hook to check if user has admin role
 */
export function useIsAdmin(): boolean {
  const { user } = useAppStore()
  return user?.role === "ADMIN" || user?.role === "BOD"
}

/**
 * Hook to check if user has leadership role
 */
export function useIsLeader(): boolean {
  const { user } = useAppStore()
  return (
    user?.role === "LEADER" ||
    user?.role === "BOD" ||
    user?.role === "ADMIN"
  )
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAppStore()
  return isAuthenticated
}

/**
 * Hook to get current user
 */
export function useCurrentUser() {
  const { user } = useAppStore()
  return user
}

/**
 * Hook to guard component rendering based on permission
 * Returns permission check result for conditional rendering
 */
export function useGuardedAccess(permission: Permission): boolean {
  return usePermission(permission)
}

/**
 * Hook to check if user can perform action on specific scope
 */
export function useCanAccess(
  permission: Permission,
  scope: "all" | "team" | "self" = "self",
): boolean {
  const { user } = useAppStore()
  if (!user) return false
  return canAccess(user.role, permission, scope)
}

/**
 * Hook to check if user is in the same organization
 */
export function useIsSameOrg(userId: string, userOrgId: string): boolean {
  const { user } = useAppStore()
  if (!user) return false
  return user.orgId === userOrgId
}

/**
 * Hook to check if user is in the same team
 */
export function useIsSameTeam(userTeamId: string | undefined): boolean {
  const { user } = useAppStore()
  if (!user || !user.teamId) return false
  return user.teamId === userTeamId
}

/**
 * Hook to check if user is self
 */
export function useIsSelf(userId: string): boolean {
  const { user } = useAppStore()
  if (!user) return false
  return user.id === userId
}

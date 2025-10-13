"use client"

import { Badge } from "@/components/ui/badge"
import { getRoleColor, getRoleLabel } from "@/lib/permissions"
import type { Role } from "@/lib/types"

export function RoleBadge({ role }: { role: Role }) {
  return (
    <Badge variant="outline" className={getRoleColor(role)}>
      {getRoleLabel(role)}
    </Badge>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTranslation } from "@/hooks/use-translation"
import { MoreVertical, Search } from "lucide-react"
import { useState } from "react"

const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    role: "admin",
    status: "active",
    lastLogin: "2025-01-13 14:30",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@company.com",
    role: "manager",
    status: "active",
    lastLogin: "2025-01-13 12:15",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@company.com",
    role: "user",
    status: "active",
    lastLogin: "2025-01-13 09:45",
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice.williams@company.com",
    role: "user",
    status: "inactive",
    lastLogin: "2025-01-10 16:20",
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie.brown@company.com",
    role: "manager",
    status: "active",
    lastLogin: "2025-01-13 11:00",
  },
]

export function UserTable() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")

  const getRoleBadge = (role: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      admin: "default",
      manager: "secondary",
      user: "outline",
    }
    return variants[role] || "outline"
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? "default" : "secondary"
  }

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("userManagement")}</CardTitle>
            <CardDescription>Manage system users and permissions</CardDescription>
          </div>
          <Button>{t("addUser")}</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("userName")}</TableHead>
                <TableHead>{t("userEmail")}</TableHead>
                <TableHead>{t("userRole")}</TableHead>
                <TableHead>{t("userStatus")}</TableHead>
                <TableHead>{t("lastLogin")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadge(user.role)}>{t(user.role)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(user.status)}>{t(user.status)}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>{t("viewUser")}</DropdownMenuItem>
                        <DropdownMenuItem>{t("editUser")}</DropdownMenuItem>
                        <DropdownMenuItem>{t("permissions")}</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">{t("deleteUser")}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

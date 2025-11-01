"use client"

import { UserTable } from "@/components/user-table"

export default function UsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Users</h1>
      <UserTable />
    </div>
  )
}
"use client"

import { UserTable } from "@/components/user-table"

export default function UsersPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-semibold mb-4">User Management</h1>
      <UserTable />
    </div>
  )
}

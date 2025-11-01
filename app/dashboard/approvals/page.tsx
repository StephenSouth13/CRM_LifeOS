"use client"

import { LeaveRequests } from "@/components/leave-requests"

export default function ApprovalsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Approvals</h1>
      <LeaveRequests />
    </div>
  )
}
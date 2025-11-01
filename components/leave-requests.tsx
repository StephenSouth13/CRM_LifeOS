"use client"

import type React from "react"

import { useState } from "react"
import { useTranslation } from "@/hooks/use-translation"
import { useAppStore } from "@/lib/store"
import { hasPermission } from "@/lib/permissions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Check, X, Plus, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import type { LeaveRequest } from "@/lib/types"

const mockLeaveRequests: LeaveRequest[] = [
    {
        id: "1",
        userId: "2",
        type: "vacation",
        status: "pending",
        startDate: new Date("2024-08-20"),
        endDate: new Date("2024-08-25"),
        reason: "Family trip",
        createdAt: new Date("2024-08-10"),
    },
]

export function LeaveRequests() {
  const { t } = useTranslation()
  const { user } = useAppStore()
  const [requests, setRequests] = useState<LeaveRequest[]>(mockLeaveRequests)
  const [activeTab, setActiveTab] = useState("my-requests")

  const canApprove = user && hasPermission(user.role, "leave.approve")

  const myRequests = requests.filter((req) => req.userId === user?.id)
  const pendingApprovals = requests.filter((req) => req.status === "pending" && req.userId !== user?.id)
  const allRequests = requests.filter((req) => req.userId !== user?.id)

  const handleApprove = (requestId: string) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: "approved",
              reviewerId: user?.id,
              reviewedAt: new Date(),
            }
          : req,
      ),
    )
  }

  const handleDeny = (requestId: string) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: "denied",
              reviewerId: user?.id,
              reviewedAt: new Date(),
            }
          : req,
      ),
    )
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getDaysDifference = (start: Date, end: Date) => {
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return diff
  }

  const getStatusColor = (status: LeaveRequest["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "approved":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "denied":
        return "bg-red-500/10 text-red-500 border-red-500/20"
    }
  }

  const getTypeColor = (type: LeaveRequest["type"]) => {
    switch (type) {
      case "sick":
        return "bg-red-500/10 text-red-500"
      case "vacation":
        return "bg-blue-500/10 text-blue-500"
      case "personal":
        return "bg-purple-500/10 text-purple-500"
      case "other":
        return "bg-gray-500/10 text-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("leave")}</CardTitle>
        <CardDescription>Manage leave requests and approvals</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
            <TabsTrigger value="my-requests">My Requests</TabsTrigger>
            {canApprove && (
                <>
                <TabsTrigger value="pending">
                    Pending Approvals
                    {pendingApprovals.length > 0 && (
                    <Badge variant="destructive" className="ml-2">
                        {pendingApprovals.length}
                    </Badge>
                    )}
                </TabsTrigger>
                <TabsTrigger value="all">All Requests</TabsTrigger>
                </>
            )}
            </TabsList>

            <TabsContent value="my-requests" className="space-y-4">
            {myRequests.length > 0 ? (
                myRequests.map((request) => (
                <LeaveRequestCard
                    key={request.id}
                    request={request}
                    formatDate={formatDate}
                    getDaysDifference={getDaysDifference}
                    getStatusColor={getStatusColor}
                    getTypeColor={getTypeColor}
                    showActions={false}
                />
                ))
            ) : (
                <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No leave requests</p>
                </CardContent>
                </Card>
            )}
            </TabsContent>

            {canApprove && (
            <>
                <TabsContent value="pending" className="space-y-4">
                {pendingApprovals.length > 0 ? (
                    pendingApprovals.map((request) => (
                    <LeaveRequestCard
                        key={request.id}
                        request={request}
                        formatDate={formatDate}
                        getDaysDifference={getDaysDifference}
                        getStatusColor={getStatusColor}
                        getTypeColor={getTypeColor}
                        showActions={true}
                        onApprove={handleApprove}
                        onDeny={handleDeny}
                    />
                    ))
                ) : (
                    <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        <Check className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No pending approvals</p>
                    </CardContent>
                    </Card>
                )}
                </TabsContent>

                <TabsContent value="all" className="space-y-4">
                {allRequests.map((request) => (
                    <LeaveRequestCard
                    key={request.id}
                    request={request}
                    formatDate={formatDate}
                    getDaysDifference={getDaysDifference}
                    getStatusColor={getStatusColor}
                    getTypeColor={getTypeColor}
                    showActions={request.status === "pending"}
                    onApprove={handleApprove}
                    onDeny={handleDeny}
                    />
                ))}
                </TabsContent>
            </>
            )}
        </Tabs>
      </CardContent>
    </Card>
  )
}

function LeaveRequestCard({
  request,
  formatDate,
  getDaysDifference,
  getStatusColor,
  getTypeColor,
  showActions,
  onApprove,
  onDeny,
}: {
  request: LeaveRequest
  formatDate: (date: Date) => string
  getDaysDifference: (start: Date, end: Date) => number
  getStatusColor: (status: LeaveRequest["status"]) => string
  getTypeColor: (type: LeaveRequest["type"]) => string
  showActions: boolean
  onApprove?: (id: string) => void
  onDeny?: (id: string) => void
}) {
  const { t } = useTranslation()
  const days = getDaysDifference(request.startDate, request.endDate)

  return (
    <motion.div whileHover={{ x: 4 }}>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getTypeColor(request.type)}>{t(request.type)}</Badge>
                <Badge className={getStatusColor(request.status)}>{t(request.status)}</Badge>
                <span className="text-sm text-muted-foreground">
                  {days} {days === 1 ? "day" : "days"}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {formatDate(request.startDate)} - {formatDate(request.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Requested on {formatDate(request.createdAt)}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">{t("reason")}:</p>
                <p className="text-sm text-muted-foreground">{request.reason}</p>
              </div>

              {request.reviewedAt && (
                <div className="text-xs text-muted-foreground">Reviewed on {formatDate(request.reviewedAt)}</div>
              )}
            </div>

            {showActions && onApprove && onDeny && (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => onApprove(request.id)}>
                  <Check className="h-4 w-4 mr-1" />
                  {t("approve")}
                </Button>
                <Button size="sm" variant="outline" onClick={() => onDeny(request.id)}>
                  <X className="h-4 w-4 mr-1" />
                  {t("deny")}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function LeaveRequestForm() {
  const { t } = useTranslation()
  const [type, setType] = useState<LeaveRequest["type"]>("vacation")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle leave request submission
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="type">{t("leaveType")}</Label>
        <Select value={type} onValue-change={(value: any) => setType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sick">{t("sick")}</SelectItem>
            <SelectItem value="vacation">{t("vacation")}</SelectItem>
            <SelectItem value="personal">{t("personal")}</SelectItem>
            <SelectItem value="other">{t("other")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>
      <div>
        <Label htmlFor="reason">{t("reason")}</Label>
        <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={4} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          {t("cancel")}
        </Button>
        <Button type="submit">{t("submit")}</Button>
      </div>
    </form>
  )
}

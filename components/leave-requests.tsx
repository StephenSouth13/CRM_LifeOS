"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useTranslation } from "@/hooks/use-translation"
import { useAppStore } from "@/lib/store"
import { hasPermission } from "@/lib/permissions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

export function LeaveRequests() {
  const { t } = useTranslation()
  const { user } = useAppStore()
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("my-requests")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    type: "vacation",
    startDate: "",
    endDate: "",
    reason: "",
  })

  useEffect(() => {
    if (user?.id && user?.orgId) {
      fetchLeaveRequests()
    }
  }, [user?.id, user?.orgId])

  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch(
        `/api/leave-requests?user_id=${user?.id}&org_id=${user?.orgId}`,
      )
      if (response.ok) {
        const data = await response.json()
        setRequests(data.requests || [])
      }
    } catch (error) {
      console.error("Failed to fetch leave requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/leave-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          org_id: user?.orgId,
          type: formData.type,
          start_date: formData.startDate,
          end_date: formData.endDate,
          reason: formData.reason,
        }),
      })

      if (response.ok) {
        setIsDialogOpen(false)
        setFormData({ type: "vacation", startDate: "", endDate: "", reason: "" })
        fetchLeaveRequests()
      }
    } catch (error) {
      console.error("Failed to create leave request:", error)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: <Clock className="h-4 w-4" /> },
      approved: { bg: "bg-green-100", text: "text-green-700", icon: <Check className="h-4 w-4" /> },
      denied: { bg: "bg-red-100", text: "text-red-700", icon: <X className="h-4 w-4" /> },
      cancelled: { bg: "bg-gray-100", text: "text-gray-700", icon: <X className="h-4 w-4" /> },
    }
    const config = colors[status] || colors.pending
    return (
      <Badge className={`${config.bg} ${config.text} gap-1`}>
        {config.icon}
        {status}
      </Badge>
    )
  }

  const myRequests = requests.filter((r) => r.user_id === user?.id)
  const teamRequests = requests.filter((r) => r.user_id !== user?.id)

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="my-requests">My Requests</TabsTrigger>
              {hasPermission(user?.role || "CUSTOMER", "leave.approve_team") && (
                <TabsTrigger value="team-requests">Team Requests</TabsTrigger>
              )}
            </TabsList>

            {hasPermission(user?.role || "CUSTOMER", "leave.create") && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Request
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Leave Request</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateRequest} className="space-y-4">
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vacation">Vacation</SelectItem>
                          <SelectItem value="sick">Sick Leave</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reason">Reason</Label>
                      <Textarea
                        id="reason"
                        placeholder="Reason for leave..."
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Submit Request
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <TabsContent value="my-requests" className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">Loading requests...</p>
              </div>
            ) : myRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No leave requests yet</p>
              </div>
            ) : (
              myRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{request.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.start_date).toLocaleDateString()} -{" "}
                        {new Date(request.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {getStatusColor(request.status)}
                </motion.div>
              ))
            )}
          </TabsContent>

          {hasPermission(user?.role || "CUSTOMER", "leave.approve_team") && (
            <TabsContent value="team-requests" className="space-y-3">
              {teamRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No team requests</p>
                </div>
              ) : (
                teamRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{request.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(request.start_date).toLocaleDateString()} -{" "}
                          {new Date(request.end_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {getStatusColor(request.status)}
                  </motion.div>
                ))
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}

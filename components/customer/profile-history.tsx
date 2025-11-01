"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

const transactionHistory = [
    {
        orderId: "ORD-2023-001",
        date: "2023-10-15",
        amount: 79.99,
        status: "Completed",
    },
    {
        orderId: "ORD-2023-002",
        date: "2023-11-01",
        amount: 150.00,
        status: "Completed",
    },
    {
        orderId: "ORD-2023-003",
        date: "2023-11-20",
        amount: 45.50,
        status: "Processing",
    },
]

export function ProfileHistory() {
  return (
    <Card>
        <Tabs defaultValue="history">
            <div className="border-b">
                <TabsList className="-mb-px ml-4 h-auto p-0 bg-transparent border-b-0">
                    <TabsTrigger value="history" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:shadow-none rounded-none">Transaction History</TabsTrigger>
                    <TabsTrigger value="profile" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:shadow-none rounded-none">My Profile</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="history">
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>A record of your past purchases and payments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactionHistory.map(t => (
                                <TableRow key={t.orderId}>
                                    <TableCell className="font-mono text-sm">{t.orderId}</TableCell>
                                    <TableCell>{t.date}</TableCell>
                                    <TableCell className="text-right font-medium">${t.amount.toFixed(2)}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={t.status === "Completed" ? "default" : "secondary"} className={t.status === "Completed" ? "bg-green-600" : ""}>{t.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </TabsContent>
            <TabsContent value="profile">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your contact and billing details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue="john.doe@example.com" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="address">Billing Address</Label>
                        <Input id="address" defaultValue="1234 Elm Street, Springfield, IL, 62704" />
                    </div>
                    <div className="flex justify-end">
                        <Button>Save Changes</Button>
                    </div>
                </CardContent>
            </TabsContent>
        </Tabs>
    </Card>
  )
}

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
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// TYPE DEFINITIONS
type CustomerStatus = "Converted" | "Contacted" | "Lead";

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: CustomerStatus;
    lastContact: string;
}

interface MiniCrmProps {
    customers?: Customer[];
}

const statusColors: { [key in CustomerStatus]: string } = {
    Converted: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800",
    Contacted: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800",
    Lead: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800",
}

export function MiniCrm({ customers = [] }: MiniCrmProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mini-CRM</CardTitle>
        <CardDescription>Manage your customer pipeline.</CardDescription>
      </CardHeader>
      <CardContent>
        {customers.length > 0 ? (
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead className="hidden md:table-cell">Last Contact</TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.map((customer) => (
                    <TableRow key={customer.id}>
                        <TableCell>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground md:hidden">
                            {customer.email}
                        </div>
                        </TableCell>
                        <TableCell>
                        <Badge variant="outline" className={statusColors[customer.status] || ""}>
                            {customer.status}
                        </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell font-mono">{customer.phone}</TableCell>
                        <TableCell className="hidden md:table-cell">{customer.lastContact}</TableCell>
                        <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Log Interaction</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        ) : (
             <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                <Users className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="font-semibold">No Customers in Pipeline</h3>
                <p className="text-sm text-muted-foreground">Your CRM is empty. Start by adding new leads.</p>
            </div>
        )}
      </CardContent>
    </Card>
  )
}

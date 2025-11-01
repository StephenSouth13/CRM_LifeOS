"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Circle, Package, Truck, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

const activeOrder = {
    orderId: "ORD-2023-003",
    estimatedDelivery: "December 5, 2023",
    status: "Shipped",
    trackingNumber: "1Z999AA10123456789",
    steps: [
        {
            name: "Order Placed",
            status: "Completed",
            date: "2023-11-20",
            icon: <Package className="h-5 w-5" />
        },
        {
            name: "Processing",
            status: "Completed",
            date: "2023-11-21",
            icon: <CheckCircle className="h-5 w-5" />
        },
        {
            name: "Shipped",
            status: "Active",
            date: "2023-11-22",
            icon: <Truck className="h-5 w-5" />
        },
        {
            name: "Delivered",
            status: "Pending",
            date: null,
            icon: <Home className="h-5 w-5" />
        }
    ]
}


export function OrderStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Order Status</CardTitle>
        <CardDescription>Tracking for order: <span className="font-semibold text-primary">{activeOrder.orderId}</span></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
            <p className="text-sm font-semibold">Estimated Delivery: {activeOrder.estimatedDelivery}</p>
            <div className="flex items-center text-sm mt-1">
                <p>Tracking: <span className="font-mono text-xs bg-muted p-1 rounded">{activeOrder.trackingNumber}</span></p>
                <Button variant="link" size="sm">Track on Carrier Site</Button>
            </div>
        </div>
        <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-3.5 top-0 h-full w-0.5 bg-border" aria-hidden="true"></div>
            
            <ul className="space-y-6">
                {activeOrder.steps.map((step, index) => {
                    const isCompleted = step.status === 'Completed';
                    const isActive = step.status === 'Active';
                    return (
                        <li key={index} className="flex items-start">
                            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isCompleted ? 'bg-primary text-primary-foreground' : isActive ? 'bg-primary/20 border-2 border-primary text-primary' : 'bg-muted text-muted-foreground'}`}>
                                {isCompleted ? <CheckCircle className="h-5 w-5" /> : step.icon}
                            </div>
                            <div className="ml-4">
                                <h4 className={`font-semibold ${isActive ? 'text-primary' : ''}`}>{step.name}</h4>
                                <p className="text-sm text-muted-foreground">{step.date}</p>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
      </CardContent>
    </Card>
  )
}

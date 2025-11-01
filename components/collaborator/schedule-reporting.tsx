"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import React from "react"

export function ScheduleReporting() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Schedule & Reporting</CardTitle>
        <CardDescription>Check your deadlines and submit progress reports.</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="flex justify-center">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border p-3"
                // Example of marking specific dates
                modifiers={{
                    deadline: [new Date(2024, 10, 20), new Date(2024, 10, 28)] 
                }}
                modifiersStyles={{
                    deadline: { 
                        textDecoration: 'underline',
                        textDecorationColor: 'hsl(var(--primary))',
                        textUnderlineOffset: '0.2em' 
                    }
                }}
            />
        </div>
        <div className="space-y-3">
            <h4 className="font-semibold">Submit a Quick Report</h4>
            <Textarea 
                placeholder="What did you work on today? Any blockers?" 
                className="h-36 resize-none"
            />
            <Button className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Submit Report
            </Button>
        </div>
      </CardContent>
    </Card>
  )
}

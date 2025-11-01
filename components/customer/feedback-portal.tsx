"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Send } from "lucide-react"

export function FeedbackPortal() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback & Support</CardTitle>
        <CardDescription>Have a question or a suggestion? Let us know!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select>
            <SelectTrigger>
                <SelectValue placeholder="Select feedback type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="inquiry">General Inquiry</SelectItem>
                <SelectItem value="bug">Report a Bug</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="praise">Praise / Compliment</SelectItem>
            </SelectContent>
        </Select>

        <Textarea placeholder="Write your message here..." className="h-32 resize-none" />
        
        <div className="flex justify-end">
            <Button>
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback
            </Button>
        </div>
      </CardContent>
    </Card>
  )
}

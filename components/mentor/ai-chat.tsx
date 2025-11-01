"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

export function AiChat() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Content Assistant</CardTitle>
        <CardDescription>Get help drafting feedback, preparing materials, or asking questions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            <div className="p-3 rounded-lg border bg-muted/30 h-40 overflow-y-auto text-sm">
                <p className="text-muted-foreground italic">[AI chat history will appear here]</p>
            </div>
            <div className="flex items-center space-x-2">
                <Input placeholder="Ask AI for help... e.g., 'Draft a positive feedback for a student who improved their coding skills'" />
                <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}

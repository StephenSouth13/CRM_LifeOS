"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function EvaluationForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Evaluation</CardTitle>
        <CardDescription>Provide detailed feedback for a student.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="student-select">Student</Label>
          <Select>
            <SelectTrigger id="student-select">
              <SelectValue placeholder="Select a student..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USR-001">Alice Johnson</SelectItem>
              <SelectItem value="USR-002">Bob Williams</SelectItem>
              <SelectItem value="USR-003">Charlie Brown</SelectItem>
              <SelectItem value="USR-004">Diana Miller</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
            <Label htmlFor="feedback-text">Feedback & Comments</Label>
            <Textarea id="feedback-text" placeholder="Enter your detailed feedback..." rows={5} />
        </div>
        <Button className="w-full">Submit Feedback</Button>
      </CardContent>
    </Card>
  )
}

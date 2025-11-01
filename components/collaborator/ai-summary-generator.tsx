"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Wand2, Copy } from "lucide-react"
import React from "react"

const generatedSummaryExample = "Completed the initial design for 5 social media graphics, which are now pending feedback. The blog post draft is 70% complete, focusing on the new feature's primary benefits. Blocked by a lack of high-resolution images for the post."

export function AiSummaryGenerator() {
    const [rawText, setRawText] = React.useState("")
    const [summary, setSummary] = React.useState("")

    const handleGenerate = () => {
        // In a real app, you would make an API call to an AI service here.
        if(rawText.trim()) {
            setSummary(generatedSummaryExample)
        } else {
            setSummary("")
        }
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Report Summarizer</CardTitle>
        <CardDescription>Paste your detailed notes and let AI create a concise summary.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea 
                placeholder="Paste your detailed report or work log here..." 
                className="h-40 resize-none"
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
            />
            <div className="relative">
                <Textarea 
                    placeholder="AI-generated summary will appear here..." 
                    className="h-40 resize-none bg-muted/50" 
                    readOnly
                    value={summary}
                />
                {summary && (
                     <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => navigator.clipboard.writeText(summary)}>
                        <Copy className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
        <Button onClick={handleGenerate} disabled={!rawText.trim()}>
            <Wand2 className="h-4 w-4 mr-2" />
            Generate Summary
        </Button>
      </CardContent>
    </Card>
  )
}

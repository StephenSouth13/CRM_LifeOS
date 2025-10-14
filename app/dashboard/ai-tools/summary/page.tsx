"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default function MeetingSummaryTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!input.trim()) return
    setLoading(true)
    setOutput("")

    try {
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      })
      const data = await res.json()
      setOutput(data.result || "No summary generated.")
    } catch (err) {
      console.error(err)
      setOutput("Error generating summary.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
        Meeting Summary
      </h1>

      <Card className="p-6 space-y-4">
        <Textarea
          rows={6}
          placeholder="Paste meeting notes or transcript here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <Button disabled={loading || !input.trim()} onClick={handleGenerate} className="w-full gap-2">
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Generate Summary
            </>
          )}
        </Button>

        {output && <Card className="p-4 bg-accent/50 whitespace-pre-wrap">{output}</Card>}
      </Card>
    </div>
  )
}

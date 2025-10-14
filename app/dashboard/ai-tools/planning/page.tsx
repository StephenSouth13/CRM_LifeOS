"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Calendar } from "lucide-react"

export default function PlanningAssistant() {
  const [prompt, setPrompt] = useState("")
  const [plan, setPlan] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/ai/planning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      setPlan(data.result)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
        Planning Assistant
      </h1>

      <Card className="p-6 space-y-4">
        <Textarea
          rows={6}
          placeholder="Describe what you want to plan (e.g., 'weekly team goals')..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button disabled={loading} onClick={handleGenerate} className="w-full gap-2">
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
              Generating...
            </>
          ) : (
            <>
              <Calendar className="h-4 w-4" /> Generate Plan
            </>
          )}
        </Button>
        {plan && <Card className="p-4 bg-accent/50 whitespace-pre-wrap">{plan}</Card>}
      </Card>
    </div>
  )
}

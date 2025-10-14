"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default function ContentGenerator() {
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/ai/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      setResult(data.result)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Content Generator
      </h1>

      <Card className="p-6 space-y-4">
        <Textarea
          rows={6}
          placeholder="Describe the post, announcement, or blog you want..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button disabled={loading} onClick={generate} className="w-full gap-2">
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Generate Content
            </>
          )}
        </Button>
        {result && <Card className="p-4 bg-accent/50 whitespace-pre-wrap">{result}</Card>}
      </Card>
    </div>
  )
}

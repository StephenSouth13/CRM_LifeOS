"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ImageIcon } from "lucide-react"

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const generateImage = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/ai/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      setImageUrl(data.url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
        Image Generator
      </h1>

      <Card className="p-6 space-y-4">
        <Input placeholder="Describe the image you want..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <Button disabled={loading} onClick={generateImage} className="w-full gap-2">
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
              Generating...
            </>
          ) : (
            <>
              <ImageIcon className="h-4 w-4" /> Generate Image
            </>
          )}
        </Button>
        {imageUrl && (
          <div className="mt-4">
            <img src={imageUrl} alt="Generated" className="rounded-lg w-full object-cover" />
          </div>
        )}
      </Card>
    </div>
  )
}

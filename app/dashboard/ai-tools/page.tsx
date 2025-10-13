"use client"

import { useState } from "react"
import { useTranslation } from "@/hooks/use-translation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Brain, FileText, ImageIcon, Calendar, MessageSquare, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function AIToolsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("summary")
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const tools = [
    {
      id: "summary",
      name: t("meetingSummary"),
      icon: FileText,
      description: "Upload meeting transcript or notes to get AI-generated summary",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "content",
      name: t("contentGenerator"),
      icon: Sparkles,
      description: "Generate announcements, blog posts, or internal communications",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "image",
      name: t("imageGenerator"),
      icon: ImageIcon,
      description: "Create AI-generated images for presentations or marketing",
      color: "from-orange-500 to-red-500",
    },
    {
      id: "planning",
      name: t("planningAssistant"),
      icon: Calendar,
      description: "AI-powered weekly/monthly planning and timeline generation",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "chat",
      name: t("aiChat"),
      icon: MessageSquare,
      description: "Chat with AI assistant for any task or question",
      color: "from-indigo-500 to-blue-500",
    },
  ]

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setResult("This is a demo AI-generated result. In production, this would call your AI API.")
    setIsGenerating(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {t("aiTools")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI-powered tools for content creation, summarization, and planning
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => {
          const Icon = tool.icon
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                  activeTab === tool.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setActiveTab(tool.id)}
              >
                <div
                  className={`h-12 w-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{tool.name}</h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* AI Workspace */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Workspace</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{t("prompt")}</label>
            <Textarea
              placeholder="Enter your prompt or paste content here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          <Button onClick={handleGenerate} disabled={isGenerating || !prompt} className="w-full gap-2">
            {isGenerating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t("generating")}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate
              </>
            )}
          </Button>

          {result && (
            <div className="mt-6">
              <label className="text-sm font-medium mb-2 block">{t("result")}</label>
              <Card className="p-4 bg-accent/50">
                <p className="text-sm whitespace-pre-wrap">{result}</p>
              </Card>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

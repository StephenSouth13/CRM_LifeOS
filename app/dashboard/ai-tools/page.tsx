"use client"

import { useTranslation } from "@/hooks/use-translation"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { FileText, ImageIcon, Calendar, MessageSquare, Sparkles } from "lucide-react"
import Link from "next/link"

export default function AIToolsPage() {
  const { t } = useTranslation()

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {t("aiTools")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI-powered tools for content creation, summarization, and planning
        </p>
      </div>

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
              <Link href={`/dashboard/ai-tools/${tool.id}`}>
                <Card
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg hover:ring-2 hover:ring-primary`}
                >
                  <div
                    className={`h-12 w-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

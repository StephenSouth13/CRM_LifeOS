"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Bot, X, Send, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function FloatingAI() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed inset-4 lg:inset-auto lg:bottom-24 lg:right-6 z-50 lg:w-96"
            >
              <Card className="border-border bg-card shadow-2xl h-full lg:h-auto flex flex-col">
                <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-4">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Bot className="h-5 w-5 text-emerald-500" />
                      <Sparkles className="absolute -right-1 -top-1 h-3 w-3 text-emerald-400 animate-pulse" />
                    </div>
                    <span className="font-semibold">AI Assistant</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="mb-4 flex-1 overflow-y-auto rounded-md bg-muted p-3">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3 h-3 text-emerald-500" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Xin chào! Tôi là trợ lý AI của Life OS. Tôi có thể giúp bạn quản lý công việc, chấm công, và
                        nhiều hơn nữa. Bạn cần hỗ trợ gì?
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Nhập tin nhắn của bạn..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[60px] resize-none"
                    />
                    <Button size="icon" className="shrink-0 bg-emerald-500 hover:bg-emerald-600 h-[60px] w-[60px]">
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bot className="h-6 w-6" />
        </Button>
      </motion.div>
    </>
  )
}

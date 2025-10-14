"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { TreePine, Clock } from "lucide-react"

interface Tree {
  id: number
  type: string
  createdAt: number
}

export function PomodoroTimer() {
  const [focusTime, setFocusTime] = useState(25)
  const [breakTime, setBreakTime] = useState(5)
  const [timeLeft, setTimeLeft] = useState(focusTime * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [forest, setForest] = useState<Tree[]>([])

  // Load forest from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("forest")
    if (saved) setForest(JSON.parse(saved))
  }, [])

  // Save forest
  useEffect(() => {
    localStorage.setItem("forest", JSON.stringify(forest))
  }, [forest])

  // Timer logic
  useEffect(() => {
    if (!isRunning) return
    if (timeLeft <= 0) {
      if (isBreak) {
        // End break → start focus
        setIsBreak(false)
        setTimeLeft(focusTime * 60)
      } else {
        // End focus → reward tree
        const newTree: Tree = {
          id: Date.now(),
          type: Math.random() > 0.5 ? "🌳" : "🌲",
          createdAt: Date.now(),
        }
        setForest((prev) => [...prev, newTree])
        setIsBreak(true)
        setTimeLeft(breakTime * 60)
      }
    }

    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [isRunning, timeLeft, isBreak, focusTime, breakTime])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const toggleTimer = () => setIsRunning(!isRunning)

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(focusTime * 60)
    setIsBreak(false)
  }

  const progress =
    ((isBreak ? breakTime * 60 - timeLeft : focusTime * 60 - timeLeft) /
      ((isBreak ? breakTime : focusTime) * 60)) *
    283

  return (
    <Card className="p-4 backdrop-blur-md bg-gradient-to-br from-indigo-500/10 to-pink-500/10 border border-indigo-200/30 shadow-inner">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Clock className="h-5 w-5 text-indigo-500" />
          Pomodoro Garden
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-center">
        {/* Setup */}
        <div className="flex justify-center gap-2 text-sm text-muted-foreground">
          <Input
            type="number"
            value={focusTime}
            onChange={(e) => setFocusTime(Number(e.target.value))}
            className="w-16 text-center"
          />
          <span>Focus</span>
          <Input
            type="number"
            value={breakTime}
            onChange={(e) => setBreakTime(Number(e.target.value))}
            className="w-16 text-center"
          />
          <span>Break</span>
        </div>

        {/* Timer circle */}
        <div className="relative flex items-center justify-center">
          <svg className="w-40 h-40">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              strokeDasharray="283"
              strokeDashoffset={283 - progress}
              transition={{ duration: 0.3 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute text-center">
            <div className="text-3xl font-bold">{formatTime(timeLeft)}</div>
            <p className="text-sm text-muted-foreground">
              {isBreak ? "Break 🍵" : "Focus 🌿"}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          <Button onClick={toggleTimer}>
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button variant="outline" onClick={resetTimer}>
            Reset
          </Button>
        </div>

        {/* Forest display */}
        <div className="pt-4 border-t border-border">
          <h4 className="flex items-center justify-center gap-2 text-sm font-medium mb-2">
            <TreePine className="h-4 w-4 text-green-500" />
            Your Forest ({forest.length})
          </h4>
          <div className="flex flex-wrap gap-2 justify-center">
            <AnimatePresence>
              {forest.map((tree) => (
                <motion.span
                  key={tree.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="text-2xl"
                >
                  {tree.type}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

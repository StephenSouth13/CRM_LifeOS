"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslation } from "@/hooks/use-translation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react"
import { motion } from "framer-motion"

export function PomodoroTimer() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<"focus" | "break">("focus")
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout>()

  const focusTime = 25 * 60
  const breakTime = 5 * 60

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      // Timer finished
      if (mode === "focus") {
        setSessions((prev) => prev + 1)
        setMode("break")
        setTimeLeft(breakTime)
      } else {
        setMode("focus")
        setTimeLeft(focusTime)
      }
      setIsRunning(false)
      // Play notification sound
      playNotificationSound()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft, mode])

  const playNotificationSound = () => {
    // Simple beep using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(mode === "focus" ? focusTime : breakTime)
  }

  const switchMode = (newMode: "focus" | "break") => {
    setMode(newMode)
    setTimeLeft(newMode === "focus" ? focusTime : breakTime)
    setIsRunning(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress =
    mode === "focus" ? ((focusTime - timeLeft) / focusTime) * 100 : ((breakTime - timeLeft) / breakTime) * 100

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {mode === "focus" ? (
            <Brain className="h-5 w-5 text-emerald-500" />
          ) : (
            <Coffee className="h-5 w-5 text-blue-500" />
          )}
          {t("pomodoro")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Selector */}
        <div className="flex gap-2">
          <Button
            variant={mode === "focus" ? "default" : "outline"}
            className="flex-1"
            onClick={() => switchMode("focus")}
          >
            <Brain className="h-4 w-4 mr-2" />
            {t("focusTime")}
          </Button>
          <Button
            variant={mode === "break" ? "default" : "outline"}
            className="flex-1"
            onClick={() => switchMode("break")}
          >
            <Coffee className="h-4 w-4 mr-2" />
            {t("breakTime")}
          </Button>
        </div>

        {/* Timer Display */}
        <div className="relative">
          <div className="flex items-center justify-center h-48">
            <motion.div
              className="text-6xl font-bold font-mono"
              animate={{ scale: isRunning && timeLeft % 2 === 0 ? 1.02 : 1 }}
              transition={{ duration: 0.5 }}
            >
              {formatTime(timeLeft)}
            </motion.div>
          </div>

          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted opacity-20"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className={mode === "focus" ? "text-emerald-500" : "text-blue-500"}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 0.5 }}
              style={{
                strokeDasharray: "1 1",
              }}
            />
          </svg>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="icon" onClick={resetTimer}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button size="lg" onClick={toggleTimer} className="px-8">
            {isRunning ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                {t("pause")}
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                {t("play")}
              </>
            )}
          </Button>
        </div>

        {/* Sessions Counter */}
        <div className="text-center text-sm text-muted-foreground">Sessions completed: {sessions}</div>
      </CardContent>
    </Card>
  )
}

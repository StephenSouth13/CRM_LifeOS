// components/pomodoro/PomodoroGarden.tsx
"use client"
import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"

export const PomodoroGarden = () => {
  const { growTree } = useAppStore()
  const [focusTime, setFocusTime] = useState(25)
  const [breakTime, setBreakTime] = useState(5)
  const [seconds, setSeconds] = useState(focusTime * 60)
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isActive) {
      timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            if (!isBreak) growTree()
            setIsBreak(!isBreak)
            return isBreak ? focusTime * 60 : breakTime * 60
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isActive, isBreak])

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60

  return (
    <motion.div
      className="rounded-3xl p-5 bg-gradient-to-br from-purple-100 to-blue-100 shadow-md flex flex-col items-center mt-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-lg font-semibold mb-2">Pomodoro Garden</h2>
      <div className="flex gap-2 mb-3">
        <input
          type="number"
          className="w-14 text-center border rounded-md p-1"
          value={focusTime}
          onChange={(e) => setFocusTime(+e.target.value)}
        />
        <span className="text-sm mt-1">Focus</span>
        <input
          type="number"
          className="w-14 text-center border rounded-md p-1"
          value={breakTime}
          onChange={(e) => setBreakTime(+e.target.value)}
        />
        <span className="text-sm mt-1">Break</span>
      </div>

      <div className="text-4xl font-bold mb-2">
        {minutes.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}
      </div>

      <div className="mb-4 text-gray-600">{isBreak ? "Break ☕" : "Focus 🌱"}</div>

      <div className="flex gap-3">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-4 py-2 rounded-lg text-white ${isActive ? "bg-red-500" : "bg-green-500"}`}
        >
          {isActive ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setIsActive(false)
            setSeconds(focusTime * 60)
          }}
          className="px-4 py-2 rounded-lg bg-gray-400 text-white"
        >
          Reset
        </button>
      </div>
    </motion.div>
  )
}

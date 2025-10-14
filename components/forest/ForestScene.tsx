"use client"

import { motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"

export function ForestScene() {
  const forest = useAppStore((s) => s.forest)
  const theme = useAppStore((s) => s.theme)

  const bgGradient = theme === "dark"
    ? "from-gray-900 via-emerald-900 to-gray-800"
    : "from-emerald-100 via-green-200 to-teal-100"

  const forestStage = useMemo(() => {
    if (forest.level < 3) return "/forest/grass.png"
    if (forest.level < 6) return "/forest/sapling.png"
    return "/forest/forest.png"
  }, [forest.level])

  return (
    <div className={`relative w-full min-h-[60vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b ${bgGradient}`}>
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Rừng */}
      <motion.img
        key={forestStage}
        src={forestStage}
        alt="Forest Stage"
        className="w-[280px] h-[280px] object-contain z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2 }}
      />

      {/* Level info */}
      <motion.div
        className="z-20 text-center mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
          Level {forest.level}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mt-2">
          🌳 Đã trồng {forest.trees} cây
        </p>
        <Button
          onClick={forest.growTree}
          className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg"
        >
          Trồng thêm cây 🌱
        </Button>
      </motion.div>
    </div>
  )
}

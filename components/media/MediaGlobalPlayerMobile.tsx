"use client"

import { useAppStore } from "@/lib/store"
import { Play, Pause } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export function MediaGlobalPlayerMobile() {
  const { globalMedia, togglePlayback, mediaPlayer } = useAppStore()
  if (!globalMedia) return null

  return (
    <AnimatePresence>
      <motion.div
        key="mobile-player"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 py-2 z-[9999]"
      >
        <div className="flex items-center gap-3">
          <img
            src={globalMedia.thumbnail || "/default-music.png"}
            alt={globalMedia.title}
            className="w-10 h-10 rounded-md object-cover"
          />
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate w-[140px]">
              {globalMedia.title}
            </p>
            <span className="text-xs text-gray-500 capitalize">
              {globalMedia.platform}
            </span>
          </div>
        </div>
        <button
          onClick={togglePlayback}
          className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full"
        >
          {mediaPlayer?.playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

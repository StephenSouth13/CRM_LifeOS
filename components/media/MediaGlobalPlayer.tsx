"use client"

import { useAppStore } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, Volume2 } from "lucide-react"
import { useRef } from "react"

export function MediaGlobalPlayer() {
  const { globalMedia, setGlobalMedia } = useAppStore()
  const { mediaPlayer, togglePlayback, setVolume } = useAppStore()
  const playerRef = useRef<HTMLAudioElement | null>(null)

  if (!globalMedia) return null

  const isPlaying = mediaPlayer?.playing ?? false

  return (
    <AnimatePresence>
      <motion.div
        key="media-player"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] md:w-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 flex items-center gap-4 z-[9999]"
      >
        <img
          src={globalMedia.thumbnail || "/default-music.png"}
          alt={globalMedia.title}
          className="w-14 h-14 rounded-lg object-cover"
        />

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 truncate">
            {globalMedia.title}
          </h4>
          <p className="text-sm text-gray-500 capitalize">
            {globalMedia.platform}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={togglePlayback}
            className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button
            onClick={() => setVolume(0.8)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full"
          >
            <Volume2 size={18} className="text-gray-700 dark:text-gray-300" />
          </button>

          <button
            onClick={() => setGlobalMedia(null)}
            className="text-sm text-gray-400 hover:text-red-500"
          >
            ✕
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

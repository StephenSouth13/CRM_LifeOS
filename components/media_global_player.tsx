"use client"

import { useAppStore } from "@/lib/store"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function MediaGlobalPlayer() {
  const { globalMedia, setGlobalMedia } = useAppStore()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (globalMedia) setVisible(true)
  }, [globalMedia])

  if (!globalMedia) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-4 right-4 z-50 w-80 rounded-xl overflow-hidden shadow-2xl border bg-background/90 backdrop-blur-md"
        >
          <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-indigo-500/20 to-pink-500/20">
            <span className="font-semibold truncate">{globalMedia.title}</span>
            <button
              onClick={() => setGlobalMedia(null)}
              className="hover:text-red-500 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="aspect-video w-full bg-black">
            {globalMedia.type === "youtube" ? (
              <iframe
                src={`https://www.youtube.com/embed/${globalMedia.id}?autoplay=1`}
                allow="autoplay; encrypted-media"
                className="w-full h-full"
              />
            ) : (
              <iframe
                src={`https://open.spotify.com/embed/track/${globalMedia.id}?utm_source=generator&theme=0`}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="w-full h-full"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

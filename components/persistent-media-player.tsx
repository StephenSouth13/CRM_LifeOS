"use client"

import { useState, useEffect, useRef } from "react"
import { useAppStore } from "@/lib/store"
import { useTranslation } from "@/hooks/use-translation"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Maximize2, Minimize2, Music } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function PersistentMediaPlayer() {
  const { t } = useTranslation()
  const { mediaPlayer, togglePlayback, updateMediaPosition, setVolume } = useAppStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [previousVolume, setPreviousVolume] = useState(70)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!mediaPlayer) return

    const interval = setInterval(() => {
      if (mediaPlayer.playing) {
        updateMediaPosition(mediaPlayer.position + 1)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [mediaPlayer, updateMediaPosition])

  if (!mediaPlayer || !mediaPlayer.currentMedia) {
    return null
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (newVolume > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume)
      setIsMuted(false)
    } else {
      setPreviousVolume(mediaPlayer.volume)
      setVolume(0)
      setIsMuted(true)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <>
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-safe"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <div className="container mx-auto px-3 lg:px-4 py-2 lg:py-3">
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Media Info */}
            <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
              <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-md bg-accent flex items-center justify-center flex-shrink-0">
                <Music className="h-5 w-5 lg:h-6 lg:w-6 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium truncate">{mediaPlayer.currentMedia.title}</p>
                <p className="text-xs text-muted-foreground">{formatTime(mediaPlayer.position)}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 lg:gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 hidden sm:flex">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button variant="default" size="icon" className="h-9 w-9 lg:h-10 lg:w-10" onClick={togglePlayback}>
                {mediaPlayer.playing ? (
                  <Pause className="h-4 w-4 lg:h-5 lg:w-5" />
                ) : (
                  <Play className="h-4 w-4 lg:h-5 lg:w-5" />
                )}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 hidden sm:flex">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Volume Control - Desktop only */}
            <div className="hidden md:flex items-center gap-2 w-32">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleMute}>
                {isMuted || mediaPlayer.volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Slider
                value={[mediaPlayer.volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="w-20"
              />
            </div>

            {/* Expand Button */}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Expanded Player Modal */}
      <AnimatePresence>
        {isExpanded && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/80 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
            />
            <motion.div
              className="fixed inset-4 md:inset-20 z-50 flex items-center justify-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <Card className="w-full h-full p-4 lg:p-6 overflow-hidden">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base lg:text-lg font-semibold">{t("nowPlaying")}</h3>
                    <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Iframe Container - Persistent */}
                  <div className="flex-1 rounded-lg overflow-hidden bg-black">
                    {mediaPlayer.currentMedia.type === "youtube" && (
                      <iframe
                        ref={iframeRef}
                        src={`https://www.youtube.com/embed/${mediaPlayer.currentMedia.id}?autoplay=${mediaPlayer.playing ? 1 : 0}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                    {mediaPlayer.currentMedia.type === "spotify" && (
                      <iframe
                        ref={iframeRef}
                        src={`https://open.spotify.com/embed/track/${mediaPlayer.currentMedia.id}`}
                        className="w-full h-full"
                        allow="encrypted-media"
                      />
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hidden iframe container to keep media loaded */}
      <div className="fixed -left-[9999px] -top-[9999px] w-0 h-0 overflow-hidden">
        {!isExpanded && mediaPlayer.currentMedia && (
          <>
            {mediaPlayer.currentMedia.type === "youtube" && (
              <iframe
                src={`https://www.youtube.com/embed/${mediaPlayer.currentMedia.id}?autoplay=${mediaPlayer.playing ? 1 : 0}`}
                allow="autoplay"
              />
            )}
            {mediaPlayer.currentMedia.type === "spotify" && (
              <iframe
                src={`https://open.spotify.com/embed/track/${mediaPlayer.currentMedia.id}`}
                allow="encrypted-media"
              />
            )}
          </>
        )}
      </div>
    </>
  )
}

"use client"
import { useState } from "react"
import YouTubeExplorer from "@/components/media/YouTubeExplorer"
import { PomodoroGarden } from "@/components/pomodoro/PomodoroGarden"
import { ForestScene } from "@/components/forest/ForestScene"

export const MediaSection = () => {
  const [tab, setTab] = useState<"youtube" | "spotify">("youtube")

  return (
    <div className="w-full flex flex-col gap-6">
      <h2 className="text-3xl font-bold tracking-tight">🎧 Media & Focus Studio</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: YouTube */}
        <div className="bg-card/40 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/10">
          <YouTubeExplorer />
        </div>

        {/* RIGHT: Spotify + Garden */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-green-700/30">
            <iframe
              className="w-full h-[400px]"
              src="https://open.spotify.com/embed/playlist/37i9dQZF1DX3rxVfibe1L0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            ></iframe>
          </div>

          <PomodoroGarden />
          <ForestScene />
        </div>
      </div>
    </div>
  )
}

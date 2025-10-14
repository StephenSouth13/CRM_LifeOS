"use client"

import { MediaSection } from "@/components/media/MediaSection"
import { PomodoroGarden} from "@/components/pomodoro/PomodoroGarden"
import { ForestScene } from "@/components/forest/ForestScene"

export default function MediaPage() {
  return (
    <div className="space-y-8 p-6">
     


      {/* Trình phát Media (YouTube, Spotify...) */}
      <section>
        <MediaSection />
      </section>
    </div>
  )
}

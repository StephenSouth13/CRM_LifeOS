"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Music, Video, Play, Plus } from "lucide-react"
import { PomodoroTimer } from "./pomodoro-timer"
import type { MediaPlayerState } from "@/lib/types"

const sampleMedia = {
  youtube: [
    { id: "dQw4w9WgXcQ", title: "Lofi Hip Hop Radio", type: "youtube" as const },
    { id: "jfKfPfyJRdk", title: "Relaxing Music", type: "youtube" as const },
  ],
  spotify: [
    { id: "3n3Ppam7vgaVa1iaRUc9Lp", title: "Mr. Brightside", type: "spotify" as const },
    { id: "0VjIjW4GlUZAMYd2vXMi3b", title: "Blinding Lights", type: "spotify" as const },
  ],
}

export function MediaSection() {
  const { user, setMediaPlayer } = useAppStore()
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [spotifyUrl, setSpotifyUrl] = useState("")

  const extractYoutubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    return match ? match[1] : null
  }

  const extractSpotifyId = (url: string) => {
    const match = url.match(/track\/([^?]+)/)
    return match ? match[1] : null
  }

  const playMedia = (media: { id: string; title: string; type: "youtube" | "spotify" }) => {
    if (!user) return

    const mediaState: MediaPlayerState = {
      userId: user.id,
      orgId: user.orgId,
      sessionId: Date.now().toString(),
      currentMedia: {
        type: media.type,
        id: media.id,
        title: media.title,
        url:
          media.type === "youtube"
            ? `https://youtube.com/watch?v=${media.id}`
            : `https://open.spotify.com/track/${media.id}`,
      },
      position: 0,
      playing: true,
      volume: 70,
      playlist: [],
    }

    setMediaPlayer(mediaState)
  }

  const handleAddYoutube = () => {
    const id = extractYoutubeId(youtubeUrl)
    if (id) {
      playMedia({ id, title: "YouTube Video", type: "youtube" })
      setYoutubeUrl("")
    }
  }

  const handleAddSpotify = () => {
    const id = extractSpotifyId(spotifyUrl)
    if (id) {
      playMedia({ id, title: "Spotify Track", type: "spotify" })
      setSpotifyUrl("")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Media & Tools</h2>
        <p className="text-muted-foreground">Music, videos, and productivity tools</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Media Player */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="youtube">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="youtube">
                    <Video className="h-4 w-4 mr-2" />
                    YouTube
                  </TabsTrigger>
                  <TabsTrigger value="spotify">
                    <Music className="h-4 w-4 mr-2" />
                    Spotify
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="youtube" className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Paste YouTube URL..."
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                    />
                    <Button onClick={handleAddYoutube}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {sampleMedia.youtube.map((media) => (
                      <div
                        key={media.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-red-500/10 flex items-center justify-center">
                            <Video className="h-5 w-5 text-red-500" />
                          </div>
                          <span className="font-medium">{media.title}</span>
                        </div>
                        <Button size="sm" onClick={() => playMedia(media)}>
                          <Play className="h-4 w-4 mr-2" />
                          Play
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="spotify" className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Paste Spotify URL..."
                      value={spotifyUrl}
                      onChange={(e) => setSpotifyUrl(e.target.value)}
                    />
                    <Button onClick={handleAddSpotify}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {sampleMedia.spotify.map((media) => (
                      <div
                        key={media.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-emerald-500/10 flex items-center justify-center">
                            <Music className="h-5 w-5 text-emerald-500" />
                          </div>
                          <span className="font-medium">{media.title}</span>
                        </div>
                        <Button size="sm" onClick={() => playMedia(media)}>
                          <Play className="h-4 w-4 mr-2" />
                          Play
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Pomodoro Timer */}
        <div>
          <PomodoroTimer />
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Music, Video, Plus, LogIn } from "lucide-react"
import Image from "next/image"
import { PomodoroTimer } from "./PomodoroTimer"
import { MediaGlobalPlayer } from "./media_global_player"

const sampleMedia = {
  youtube: [
    {
      id: "dQw4w9WgXcQ",
      title: "Lofi Hip Hop Radio",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      type: "youtube" as const,
    },
    {
      id: "jfKfPfyJRdk",
      title: "Relaxing Music",
      thumbnail: "https://img.youtube.com/vi/jfKfPfyJRdk/hqdefault.jpg",
      type: "youtube" as const,
    },
  ],
  spotify: [
    {
      id: "3n3Ppam7vgaVa1iaRUc9Lp",
      title: "Mr. Brightside",
      thumbnail:
        "https://i.scdn.co/image/ab67616d0000b2731a2e9a0f63a44a8c83eeb0f0",
      type: "spotify" as const,
    },
    {
      id: "0VjIjW4GlUZAMYd2vXMi3b",
      title: "Blinding Lights",
      thumbnail:
        "https://i.scdn.co/image/ab67616d0000b2738f76d2dfb9c80f1f8a3a6e04",
      type: "spotify" as const,
    },
  ],
}

export function MediaSection() {
  const { user, setGlobalMedia } = useAppStore()
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

  const handlePlay = (media: any) => {
    if (!user) return alert("Vui lòng đăng nhập để nghe 🎧")
    setGlobalMedia(media)
  }

  const handleAddYoutube = () => {
    const id = extractYoutubeId(youtubeUrl)
    if (id) {
      setGlobalMedia({
        id,
        title: "Custom YouTube Video",
        type: "youtube",
      })
      setYoutubeUrl("")
    }
  }

  const handleAddSpotify = () => {
    const id = extractSpotifyId(spotifyUrl)
    if (id) {
      setGlobalMedia({
        id,
        title: "Custom Spotify Track",
        type: "spotify",
      })
      setSpotifyUrl("")
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">🎧 Media Studio</h2>
        <p className="text-muted-foreground">
          Nghe nhạc, xem video và tập trung cùng Pomodoro Garden 🌿
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="youtube" className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="youtube">
                    <Video className="h-4 w-4 mr-2" /> YouTube
                  </TabsTrigger>
                  <TabsTrigger value="spotify">
                    <Music className="h-4 w-4 mr-2" /> Spotify
                  </TabsTrigger>
                </TabsList>

                {/* YouTube Tab */}
                <TabsContent value="youtube" className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Paste YouTube URL..."
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                    />
                    <Button onClick={handleAddYoutube}>
                      <Plus className="h-4 w-4 mr-2" /> Add
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sampleMedia.youtube.map((media) => (
                      <div
                        key={media.id}
                        className="rounded-xl overflow-hidden border hover:shadow-md transition"
                      >
                        <div className="relative">
                          <Image
                            src={media.thumbnail}
                            alt={media.title}
                            width={400}
                            height={225}
                            className="w-full h-40 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition">
                            {user ? (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handlePlay(media)}
                              >
                                Play ▶
                              </Button>
                            ) : (
                              <Button variant="outline" disabled>
                                <LogIn className="h-4 w-4 mr-2" /> Login
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="font-medium truncate">{media.title}</p>
                          <p className="text-xs text-muted-foreground">
                            YouTube
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Spotify Tab */}
                <TabsContent value="spotify" className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Paste Spotify URL..."
                      value={spotifyUrl}
                      onChange={(e) => setSpotifyUrl(e.target.value)}
                    />
                    <Button onClick={handleAddSpotify}>
                      <Plus className="h-4 w-4 mr-2" /> Add
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sampleMedia.spotify.map((media) => (
                      <div
                        key={media.id}
                        className="rounded-xl overflow-hidden border hover:shadow-md transition"
                      >
                        <div className="relative">
                          <Image
                            src={media.thumbnail}
                            alt={media.title}
                            width={400}
                            height={225}
                            className="w-full h-40 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition">
                            {user ? (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handlePlay(media)}
                              >
                                Play ▶
                              </Button>
                            ) : (
                              <Button variant="outline" disabled>
                                <LogIn className="h-4 w-4 mr-2" /> Login
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="font-medium truncate">{media.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Spotify
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Pomodoro bên phải */}
        <div>
          <PomodoroTimer />
        </div>
      </div>

      {/* Player nổi cố định */}
      <MediaGlobalPlayer />
    </div>
  )
}

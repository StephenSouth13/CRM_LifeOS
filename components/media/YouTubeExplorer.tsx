"use client"

import { useState, useEffect, useRef } from "react"
import YouTube from "react-youtube"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const API_KEY = "AIzaSyAzXEnzEJnxo_SrjacbOlAbDDqI-KihpYI" // ⚠️ Thay bằng API key của bạn

export default function YouTubeExplorer() {
  const [query, setQuery] = useState("lofi chill mix")
  const [videos, setVideos] = useState<any[]>([])
  const [currentVideo, setCurrentVideo] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const playerRef = useRef<any>(null)

  const fetchVideos = async (searchQuery: string) => {
    try {
      setLoading(true)
      const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(
          searchQuery,
        )}&key=${API_KEY}`,
      )
      setVideos(res.data.items)
      setCurrentVideo(res.data.items[0]?.id?.videoId || "")
      setCurrentIndex(0)
    } catch (err) {
      console.error("YouTube API error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos(query)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchVideos(query)
  }

  const onEnd = () => {
    const nextIndex = currentIndex + 1
    if (nextIndex < videos.length) {
      setCurrentVideo(videos[nextIndex].id.videoId)
      setCurrentIndex(nextIndex)
    }
  }

  const opts = {
    width: "100%",
    height: "400",
    playerVars: {
      autoplay: 1,
    },
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm video YouTube..."
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Tìm"}
        </Button>
      </form>

      {currentVideo && (
        <div className="rounded-xl overflow-hidden shadow-lg">
          <YouTube
            videoId={currentVideo}
            opts={opts}
            onEnd={onEnd}
            onReady={(e) => (playerRef.current = e.target)}
          />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
        {videos.map((v, idx) => (
  <div
    key={`${v.id.videoId || v.etag || idx}`}

            onClick={() => {
              setCurrentVideo(v.id.videoId)
              setCurrentIndex(idx)
              playerRef.current?.loadVideoById(v.id.videoId)
            }}
            className={`cursor-pointer bg-muted/30 rounded-xl overflow-hidden hover:bg-muted/50 transition ${
              currentVideo === v.id.videoId ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <img
              src={v.snippet.thumbnails.medium.url}
              alt={v.snippet.title}
              className="w-full h-36 object-cover"
            />
            <p className="p-2 text-sm font-medium line-clamp-2">{v.snippet.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

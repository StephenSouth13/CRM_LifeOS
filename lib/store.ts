//D:\CRM\CRM_LifeOS\lib\store.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Language } from "./i18n"
import type { User, MediaPlayerState, Section } from "./types"

// 🎧 Global Media item
export interface MediaItem {
  id: string
  title: string
  platform: "youtube" | "spotify" | "lofi"
  url?: string
  thumbnail?: string
  currentTime?: number
}

// 🌳 Forest State
interface ForestState {
  level: number
  trees: number
  growTree: () => void
  resetForest: () => void
}

// ⏱️ Pomodoro State
interface PomodoroState {
  isRunning: boolean
  timeLeft: number
  totalSessions: number
  focusMode: boolean
  startPomodoro: (duration: number) => void
  pausePomodoro: () => void
  tickPomodoro: () => void
  resetPomodoro: () => void
  toggleFocusMode: () => void
}

// 💾 AppState tổng thể
interface AppState {
  theme: "light" | "dark"
  language: Language
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  // 🎧 Media
  mediaPlayer: MediaPlayerState | null
  globalMedia: MediaItem | null
  setGlobalMedia: (media: MediaItem | null) => void

  // 🌳 Forest
  forest: ForestState

  // ⏱️ Pomodoro
  pomodoro: PomodoroState

  // 🧩 Sections
  sections: Section[]
  setSections: (sections: Section[]) => void
  toggleSection: (id: string) => void
  reorderSections: (sections: Section[]) => void

  // 📱 Sidebar
  sidebarOpen: boolean
  toggleSidebar: () => void
  closeSidebar: () => void

  // 👤 User & Auth
  setTheme: (theme: "light" | "dark") => void
  toggleTheme: () => void
  setLanguage: (language: Language) => void
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (email: string, password: string, name: string, org_id: string) => Promise<boolean>
  setUser: (user: User) => void
  setIsLoading: (loading: boolean) => void
  updateUser: (updates: Partial<User>) => void

  // 🎧 Media controls
  setMediaPlayer: (state: MediaPlayerState) => void
  updateMediaPosition: (position: number) => void
  togglePlayback: () => void
  setVolume: (volume: number) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      language: "vi",
      user: null,
      isAuthenticated: false,
      isLoading: false,
      mediaPlayer: null,
      globalMedia: null,

      // 🌳 Forest gamification
      forest: {
        level: 1,
        trees: 0,
        growTree: () =>
          set((state) => {
            const newCount = state.forest.trees + 1
            const newLevel = Math.floor(newCount / 5) + 1
            return {
              forest: { ...state.forest, trees: newCount, level: newLevel },
            }
          }),
        resetForest: () =>
          set({
            forest: {
              level: 1,
              trees: 0,
              growTree: get().forest.growTree,
              resetForest: get().forest.resetForest,
            },
          }),
      },

      // ⏱️ Pomodoro state
      pomodoro: {
        isRunning: false,
        timeLeft: 25 * 60,
        totalSessions: 0,
        focusMode: false,
        startPomodoro: (duration: number) =>
          set((state) => ({
            pomodoro: { ...state.pomodoro, isRunning: true, timeLeft: duration },
          })),
        pausePomodoro: () =>
          set((state) => ({
            pomodoro: { ...state.pomodoro, isRunning: false },
          })),
        tickPomodoro: () => {
          const p = get().pomodoro
          if (p.isRunning && p.timeLeft > 0) {
            set({
              pomodoro: { ...p, timeLeft: p.timeLeft - 1 },
            })
          } else if (p.isRunning && p.timeLeft === 0) {
            get().forest.growTree()
            set({
              pomodoro: {
                ...p,
                isRunning: false,
                totalSessions: p.totalSessions + 1,
                timeLeft: 25 * 60,
              },
            })
          }
        },
        resetPomodoro: () =>
          set({
            pomodoro: {
              isRunning: false,
              timeLeft: 25 * 60,
              totalSessions: 0,
              focusMode: false,
              startPomodoro: get().pomodoro.startPomodoro,
              pausePomodoro: get().pomodoro.pausePomodoro,
              tickPomodoro: get().pomodoro.tickPomodoro,
              resetPomodoro: get().pomodoro.resetPomodoro,
              toggleFocusMode: get().pomodoro.toggleFocusMode,
            },
          }),
        toggleFocusMode: () =>
          set((state) => ({
            pomodoro: {
              ...state.pomodoro,
              focusMode: !state.pomodoro.focusMode,
            },
          })),
      },

      sections: [],
      sidebarOpen: false,

      // 🎨 Theme & Language
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      setLanguage: (language) => set({ language }),

      // 🔐 Auth with Supabase
      login: async (email, password) => {
        try {
          set({ isLoading: true })
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          })

          // Use clone() to inspect body safely, then parse original as JSON
          let bodyText = null
          try {
            bodyText = await response.clone().text()
          } catch (e) {
            console.warn("Failed to clone response body:", e)
          }

          if (!response.ok) {
            // Provide richer debug info: status and body text
            console.error(
              `Login failed: status=${response.status} ${response.statusText}`,
            )
            if (bodyText) {
              try {
                const parsed = JSON.parse(bodyText)
                console.error("Login response body:", parsed)
              } catch (e) {
                console.error("Login response body (text):", bodyText)
              }
            } else {
              console.error("Login response body: <empty>")
            }
            return false
          }

          let data: any = {}
          try {
            data = await response.json()
          } catch (e) {
            // Fallback to parsed text if response.json() fails
            try {
              data = bodyText ? JSON.parse(bodyText) : {}
            } catch (err) {
              console.warn("Couldn't parse login response JSON, falling back to empty object", err)
              data = {}
            }
          }

          const { user } = data || {}
          if (!user) {
            console.error("No user in response, full response:", data)
            return false
          }
          if (!user) {
            console.error("No user in response")
            return false
          }

          set({ user, isAuthenticated: true })
          return true
        } catch (error) {
          console.error("Login error:", error)
          return false
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          mediaPlayer: null,
          globalMedia: null,
          forest: { ...get().forest, trees: 0, level: 1 },
        }),

      register: async (email, password, name, org_id) => {
        try {
          set({ isLoading: true })
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name, org_id }),
          })

          let bodyText = null
          try {
            bodyText = await response.clone().text()
          } catch (e) {
            console.warn("Failed to clone register response body:", e)
          }

          if (!response.ok) {
            console.error(`Registration failed: status=${response.status} ${response.statusText}`)
            if (bodyText) {
              try {
                console.error("Registration response body:", JSON.parse(bodyText))
              } catch (e) {
                console.error("Registration response body (text):", bodyText)
              }
            }
            return false
          }

          let data: any = {}
          try {
            data = await response.json()
          } catch (e) {
            try {
              data = bodyText ? JSON.parse(bodyText) : {}
            } catch (err) {
              console.warn("Couldn't parse register response JSON, falling back to empty object", err)
              data = {}
            }
          }

          // Registration succeeded. Backend may not return a full session/user.
          // Do NOT auto-authenticate the user here; require explicit login or callback flow.
          if (response.status === 201 || response.status === 200) {
            console.info("Registration successful")
            return true
          }

          // If backend returned a user (some flows might), keep it but do not set isAuthenticated
          const { user } = data || {}
          if (user) {
            set({ user })
          }

          return true
        } catch (error) {
          console.error("Registration error:", error)
          return false
        } finally {
          set({ isLoading: false })
        }
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setIsLoading: (loading) => set({ isLoading: loading }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      // 🎧 Media controls
      setMediaPlayer: (mediaPlayer) => set({ mediaPlayer }),
      updateMediaPosition: (position) =>
        set((state) => ({
          mediaPlayer: state.mediaPlayer
            ? { ...state.mediaPlayer, position }
            : null,
        })),
      togglePlayback: () =>
        set((state) => ({
          mediaPlayer: state.mediaPlayer
            ? { ...state.mediaPlayer, playing: !state.mediaPlayer.playing }
            : null,
        })),
      setVolume: (volume) =>
        set((state) => ({
          mediaPlayer: state.mediaPlayer
            ? { ...state.mediaPlayer, volume }
            : null,
        })),

      // 🌍 Global Media
      setGlobalMedia: (media) => set({ globalMedia: media }),

      // 🧩 Sections
      setSections: (sections) => set({ sections }),
      toggleSection: (id) =>
        set((state) => ({
          sections: state.sections.map((s) =>
            s.id === id ? { ...s, visible: !s.visible } : s,
          ),
        })),
      reorderSections: (sections) => set({ sections }),

      // 📱 Sidebar
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      closeSidebar: () => set({ sidebarOpen: false }),
    }),
    {
      name: "life-os-storage",
    },
  ),
)

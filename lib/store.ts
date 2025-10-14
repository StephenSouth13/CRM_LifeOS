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

  // 👤 User
  setTheme: (theme: "light" | "dark") => void
  toggleTheme: () => void
  setLanguage: (language: Language) => void
  login: (email: string, password: string) => boolean
  logout: () => void
  register: (email: string, password: string, name: string) => boolean
  setUser: (user: User) => void

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
            // ⏰ Hoàn thành → trồng cây 🌳
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

      // 🔐 Auth
      login: (email, password) => {
        const demoUsers: Record<string, { password: string; user: User }> = {
          longvsm: {
            password: "123456",
            user: {
              id: "1",
              email: "longvsm@lifeos.com",
              name: "Long VSM",
              role: "owner",
              orgId: "org-1",
              avatar: "/person-holding-keys.png",
              createdAt: new Date(),
            },
          },
          admin: {
            password: "123456",
            user: {
              id: "2",
              email: "admin@lifeos.com",
              name: "Admin User",
              role: "admin",
              orgId: "org-1",
              avatar: "/admin-interface.png",
              createdAt: new Date(),
            },
          },
        }

        const account = demoUsers[email]
        if (account && account.password === password) {
          set({ user: account.user, isAuthenticated: true })
          return true
        }
        return false
      },

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          mediaPlayer: null,
          globalMedia: null,
          forest: { ...get().forest, trees: 0, level: 1 },
        }),

      register: (email, password, name) => {
        const newUser: User = {
          id: Date.now().toString(),
          email,
          name,
          role: "staff",
          orgId: "org-1",
          avatar: "/abstract-geometric-shapes.png",
          createdAt: new Date(),
        }
        set({ user: newUser, isAuthenticated: true })
        return true
      },

      setUser: (user) => set({ user }),

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

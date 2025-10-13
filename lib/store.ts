import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Language } from "./i18n"
import type { User, MediaPlayerState, Section } from "./types"

interface AppState {
  theme: "light" | "dark"
  language: Language
  user: User | null
  isAuthenticated: boolean

  // Media player state
  mediaPlayer: MediaPlayerState | null

  // Sections state
  sections: Section[]

  // Mobile state
  sidebarOpen: boolean

  // Actions
  setTheme: (theme: "light" | "dark") => void
  setLanguage: (language: Language) => void
  toggleTheme: () => void
  login: (email: string, password: string) => boolean
  logout: () => void
  register: (email: string, password: string, name: string) => boolean
  setUser: (user: User) => void

  // Media player actions
  setMediaPlayer: (state: MediaPlayerState) => void
  updateMediaPosition: (position: number) => void
  togglePlayback: () => void
  setVolume: (volume: number) => void

  // Section actions
  setSections: (sections: Section[]) => void
  toggleSection: (id: string) => void
  reorderSections: (sections: Section[]) => void

  // Mobile actions
  toggleSidebar: () => void
  closeSidebar: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "dark",
      language: "vi",
      user: null,
      isAuthenticated: false,
      mediaPlayer: null,
      sections: [],
      sidebarOpen: false,

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),

      login: (email, password) => {
        // Demo accounts with different roles
        const demoAccounts: Record<string, { password: string; user: User }> = {
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
          leader: {
            password: "123456",
            user: {
              id: "3",
              email: "leader@lifeos.com",
              name: "Team Leader",
              role: "leader",
              orgId: "org-1",
              teamId: "team-1",
              avatar: "/inspirational-leader.png",
              createdAt: new Date(),
            },
          },
          staff: {
            password: "123456",
            user: {
              id: "4",
              email: "staff@lifeos.com",
              name: "Staff Member",
              role: "staff",
              orgId: "org-1",
              teamId: "team-1",
              avatar: "/diverse-office-staff.png",
              createdAt: new Date(),
            },
          },
        }

        const account = demoAccounts[email]
        if (account && account.password === password) {
          set({ user: account.user, isAuthenticated: true })
          return true
        }
        return false
      },

      logout: () => set({ user: null, isAuthenticated: false, mediaPlayer: null }),

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

      // Media player actions
      setMediaPlayer: (mediaPlayer) => set({ mediaPlayer }),
      updateMediaPosition: (position) =>
        set((state) => ({
          mediaPlayer: state.mediaPlayer ? { ...state.mediaPlayer, position } : null,
        })),
      togglePlayback: () =>
        set((state) => ({
          mediaPlayer: state.mediaPlayer ? { ...state.mediaPlayer, playing: !state.mediaPlayer.playing } : null,
        })),
      setVolume: (volume) =>
        set((state) => ({
          mediaPlayer: state.mediaPlayer ? { ...state.mediaPlayer, volume } : null,
        })),

      // Section actions
      setSections: (sections) => set({ sections }),
      toggleSection: (id) =>
        set((state) => ({
          sections: state.sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)),
        })),
      reorderSections: (sections) => set({ sections }),

      // Mobile actions
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      closeSidebar: () => set({ sidebarOpen: false }),
    }),
    {
      name: "life-os-storage",
    },
  ),
)

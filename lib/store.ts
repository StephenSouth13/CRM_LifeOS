import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { User, Role, Permission, UserStatus } from "@/lib/types"
import { ROLE_PERMISSIONS } from "@/lib/permissions"

// A mock organization ID for the demo
const ORG_ID = "org-1"

interface AppState {
  user: User | null
  isAuthenticated: boolean
  sidebarOpen: boolean
  language: "vi" | "en"
  users: Record<string, User>
  pendingUsers: Record<string, User>
  login: (credentials: { email: string }) => Promise<User | null>
  logout: () => void
  register: (
    userData: Omit<User, "id" | "createdAt" | "orgId" | "status" | "role"> & {
      role?: Role
    },
  ) => Promise<boolean>
  approveUser: (email: string) => void
  denyUser: (email: string) => void
  setLanguage: (language: "vi" | "en") => void
  hasPermission: (permission: Permission) => boolean
  toggleSidebar: () => void
  closeSidebar: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // -- STATE --
      user: null,
      isAuthenticated: false,
      sidebarOpen: false,
      language: "vi",
      pendingUsers: {},
      users: {
        "longvsm@lifeos.com": {
          id: "1",
          name: "VSM Long",
          email: "longvsm@lifeos.com",
          role: "owner",
          orgId: ORG_ID,
          avatar: "/person-holding-keys.png",
          createdAt: new Date(),
          status: "active",
        },
        "admin@hrm.com": {
          id: "2",
          name: "Admin User",
          email: "admin@hrm.com",
          role: "admin",
          orgId: ORG_ID,
          avatar: "/admin-interface.png",
          createdAt: new Date(),
          status: "active",
        },
        "user@hrm.com": {
          id: "3",
          name: "Staff User",
          email: "user@hrm.com",
          role: "staff",
          orgId: ORG_ID,
          avatar: "/space-background.png",
          createdAt: new Date(),
          status: "active",
        },
      },

      // -- ACTIONS --
      login: async ({ email }) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        if (typeof email !== "string") return null

        const user = get().users[email.toLowerCase()]

        if (user && user.status === "active") {
          set({ user, isAuthenticated: true })
          return user
        }

        set({ user: null, isAuthenticated: false })
        return null
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, sidebarOpen: false })
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login"
        }
      },

      register: async (userData) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const email = userData.email.toLowerCase()

        if (get().users[email] || get().pendingUsers[email]) {
          return false // User already exists
        }

        const newUser: User = {
          ...userData,
          id: `user-${Date.now()}`,
          createdAt: new Date(),
          orgId: ORG_ID,
          status: "pending",
          role: userData.role || "staff", // Default to 'staff' if not provided
        }

        set((state) => ({
          pendingUsers: { ...state.pendingUsers, [email]: newUser },
        }))

        return true
      },

      approveUser: (email) => {
        set((state) => {
          const userToApprove = state.pendingUsers[email]
          if (!userToApprove) return {}

          const approvedUser: User = { ...userToApprove, status: "active" }

          const newUsers = { ...state.users, [email]: approvedUser }
          const newPending = { ...state.pendingUsers }
          delete newPending[email]

          return { users: newUsers, pendingUsers: newPending }
        })
      },

      denyUser: (email) => {
        set((state) => {
          const newPending = { ...state.pendingUsers }
          delete newPending[email]
          return { pendingUsers: newPending }
        })
      },

      setLanguage: (language) => set({ language }),

      hasPermission: (permission) => {
        const user = get().user
        if (!user) return false
        const userPermissions = ROLE_PERMISSIONS[user.role] || []
        return userPermissions.includes(permission)
      },

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      closeSidebar: () => set({ sidebarOpen: false }),
    }),
    {
      name: "app-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage),
      // A custom merge function to handle Date objects during rehydration
      merge: (persistedState, currentState) => {
        const merged = { ...currentState, ...(persistedState as object) }
        // Rekindle Date objects
        if (merged.user) {
          merged.user.createdAt = new Date(merged.user.createdAt)
        }
        Object.values(merged.users).forEach((user: any) => {
          user.createdAt = new Date(user.createdAt)
        })
        Object.values(merged.pendingUsers).forEach((user: any) => {
          user.createdAt = new Date(user.createdAt)
        })
        return merged
      },
    },
  ),
)

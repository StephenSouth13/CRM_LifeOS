"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"

export default function HomePage() {
  const router = useRouter()
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)

  useEffect(() => {
    // Based on the authentication state, redirect the user to the appropriate page
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      // If the user is not authenticated, redirect to the login page
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Render a loading indicator while the redirect is in progress
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        <span className="text-muted-foreground">Redirecting...</span>
      </div>
    </div>
  )
}

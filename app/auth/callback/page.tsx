"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabaseBrowser } from "@/lib/supabase/supabase"
import { useAppStore } from "@/lib/store"

export default function AuthCallbackPage() {
  const router = useRouter()
  const params = useSearchParams()
  const setUser = useAppStore((s) => s.setUser)

  useEffect(() => {
    async function run() {
      const { data: userData } = await supabaseBrowser.auth.getUser()
      const supaUser = userData?.user
      if (!supaUser?.id || !supaUser?.email) {
        router.replace("/auth/login")
        return
      }

      const res = await fetch("/api/auth/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: supaUser.id, email: supaUser.email, name: supaUser.user_metadata?.name }),
      })

      if (res.ok) {
        const { user } = await res.json()
        if (user) {
          setUser(user)
          router.replace("/dashboard")
          return
        }
      }

      const emailParam = encodeURIComponent(supaUser.email)
      router.replace(`/auth/register?email=${emailParam}`)
    }

    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-sm text-muted-foreground">Đang xử lý đăng nhập...</div>
    </div>
  )
}

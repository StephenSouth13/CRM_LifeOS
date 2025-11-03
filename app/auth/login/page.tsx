"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppStore } from "@/lib/store"
import { useTranslation } from "@/hooks/use-translation"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogIn, Mail, Lock, Github, Chrome } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabaseBrowser } from "@/lib/supabase/supabase"

export default function LoginPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const { toast } = useToast()
  const login = useAppStore((state) => state.login)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const success = await login(email, password)

    if (success) {
      toast({
        title: t("loginSuccess"),
        description: t("welcomeBack"),
      })
      router.push("/dashboard")
    } else {
      toast({
        title: "Error",
        description: t("invalidCredentials"),
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <LogIn className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Life OS</h1>
              <p className="text-sm text-muted-foreground">Enterprise Management</p>
            </div>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">{t("welcomeBack")}</h2>
            <p className="text-muted-foreground">{t("loginSubtitle")}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  {t("rememberMe")}
                </Label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                {t("forgotPassword")}
              </Link>
            </div>

            <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" size="lg" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t("login")}</span>
                </div>
              ) : (
                t("login")
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">{t("orContinueWith")}</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={async () => {
                setIsLoading(true)
                await supabaseBrowser.auth.signInWithOAuth({
                  provider: "github",
                  options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
                })
                setIsLoading(false)
              }}
            >
              <Github className="w-4 h-4 mr-2" />
              Github
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={async () => {
                setIsLoading(true)
                await supabaseBrowser.auth.signInWithOAuth({
                  provider: "google",
                  options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
                })
                setIsLoading(false)
              }}
            >
              <Chrome className="w-4 h-4 mr-2" />
              Google
            </Button>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-muted-foreground">
            {t("dontHaveAccount")}{" "}
            <Link
              href="/auth/register"
              className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
            >
              {t("register")}
            </Link>
          </p>

        </motion.div>
      </div>

      {/* Right side - Image/Gradient */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6 text-center"
          >
            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto">
              <LogIn className="w-12 h-12" />
            </div>
            <h2 className="text-4xl font-bold">Quản lý cuộc sống doanh nghiệp</h2>
            <p className="text-xl text-white/90 max-w-md">
              Nền tảng quản lý toàn diện cho doanh nghiệp hiện đại với công nghệ tiên tiến
            </p>
            <div className="flex items-center gap-8 justify-center pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-white/80">Người dùng</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-sm text-white/80">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-white/80">Hỗ trợ</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

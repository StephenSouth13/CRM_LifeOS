//app/auth/register/page.tsx
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
import { UserPlus, Mail, Lock, User, Github, Chrome } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabaseBrowser } from "@/lib/supabase/supabase"

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const { toast } = useToast()
  const register = useAppStore((state) => state.register)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    orgId: "",
  })
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (!agreeToTerms) {
      toast({
        title: "Error",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      })
      return
    }

    if (!formData.orgId) {
      toast({ title: "Error", description: "Organization ID is required", variant: "destructive" })
      return
    }

    setIsLoading(true)

    const success = await register(formData.email, formData.password, formData.name, formData.orgId)

    if (success) {
      toast({ title: t("registerSuccess"), description: t("welcomeBack") })
      router.push("/dashboard")
    } else {
      toast({ title: "Error", description: "Registration failed. Check console for details.", variant: "destructive" })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image/Gradient */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-teal-500 via-emerald-600 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6 text-center"
          >
            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto">
              <UserPlus className="w-12 h-12" />
            </div>
            <h2 className="text-4xl font-bold">Bắt đầu hành trình của bạn</h2>
            <p className="text-xl text-white/90 max-w-md">
              Tham gia cùng hàng nghìn doanh nghiệp đang sử dụng Life OS để quản lý hiệu quả
            </p>
            <div className="grid grid-cols-2 gap-4 pt-8 max-w-sm mx-auto">
              <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                <div className="text-2xl font-bold">✓</div>
                <div className="text-sm mt-2">Miễn phí 30 ngày</div>
              </div>
              <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                <div className="text-2xl font-bold">✓</div>
                <div className="text-sm mt-2">Không cần thẻ</div>
              </div>
              <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                <div className="text-2xl font-bold">✓</div>
                <div className="text-sm mt-2">Hỗ trợ 24/7</div>
              </div>
              <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                <div className="text-2xl font-bold">✓</div>
                <div className="text-sm mt-2">Dễ dàng hủy</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
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
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Life OS</h1>
              <p className="text-sm text-muted-foreground">Enterprise Management</p>
            </div>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">{t("createAccount")}</h2>
            <p className="text-muted-foreground">{t("registerSubtitle")}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("fullName")}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nguyen Van A"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgId">Organization ID</Label>
                <div className="relative">
                  <Input
                    id="orgId"
                    type="text"
                    placeholder="Your organization ID"
                    value={formData.orgId}
                    onChange={(e) => setFormData({ ...formData, orgId: e.target.value })}
                    className="pl-3"
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
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                {t("agreeToTerms")}{" "}
                <Link href="/terms" className="text-emerald-500 hover:text-emerald-400">
                  {t("termsOfService")}
                </Link>{" "}
                {t("and")}{" "}
                <Link href="/privacy" className="text-emerald-500 hover:text-emerald-400">
                  {t("privacyPolicy")}
                </Link>
              </Label>
            </div>

            <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" size="lg" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t("register")}</span>
                </div>
              ) : (
                t("register")
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

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground">
            {t("alreadyHaveAccount")}{" "}
            <Link href="/auth/login" className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors">
              {t("login")}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

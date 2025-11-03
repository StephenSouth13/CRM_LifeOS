// File: app/auth/forgot-password/page.tsx
"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslation } from "@/hooks/use-translation"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setEmailSent(true)
    toast({
      title: t("emailSent"),
      description: t("checkYourEmail"),
    })

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
              <KeyRound className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Life OS</h1>
              <p className="text-sm text-muted-foreground">Enterprise Management</p>
            </div>
          </div>

          {!emailSent ? (
            <>
              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">{t("resetPassword")}</h2>
                <p className="text-muted-foreground">{t("resetPasswordSubtitle")}</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t("sendResetLink")}</span>
                    </div>
                  ) : (
                    t("sendResetLink")
                  )}
                </Button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{t("emailSent")}</h2>
                <p className="text-muted-foreground">{t("checkYourEmail")}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  Email đã được gửi đến <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>
            </motion.div>
          )}

          {/* Back to Login */}
          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backToLogin")}
          </Link>
        </motion.div>
      </div>

      {/* Right side - Image/Gradient */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-500 via-emerald-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6 text-center"
          >
            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto">
              <KeyRound className="w-12 h-12" />
            </div>
            <h2 className="text-4xl font-bold">Bảo mật tài khoản</h2>
            <p className="text-xl text-white/90 max-w-md">
              Chúng tôi sẽ gửi liên kết đặt lại mật khẩu đến email của bạn trong vài phút
            </p>
            <div className="space-y-4 pt-8 max-w-sm mx-auto">
              <div className="flex items-start gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div>
                  <div className="font-medium">Kiểm tra email</div>
                  <div className="text-sm text-white/80">Mở email chúng tôi vừa gửi</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div>
                  <div className="font-medium">Nhấp vào liên kết</div>
                  <div className="text-sm text-white/80">Liên kết có hiệu lực trong 1 giờ</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div>
                  <div className="font-medium">Tạo mật khẩu mới</div>
                  <div className="text-sm text-white/80">Chọn mật khẩu mạnh và an toàn</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

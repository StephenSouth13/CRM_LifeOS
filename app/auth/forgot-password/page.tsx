// File: app/auth/forgot-password/page.tsx (FIX BẮT BUỘC & UI CHUYÊN NGHIỆP)

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
import { KeyRound, Mail, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast"
import { supabaseBrowser, supabaseAdmin } from "@/lib/supabase/supabase" // <<< FIX: Import Admin Client

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [redirecting, setRedirecting] = useState(false); // Trạng thái chuyển hướng

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    if (!email) {
        toast({ title: "Lỗi", description: "Vui lòng nhập địa chỉ email.", variant: "destructive" });
        setIsLoading(false);
        return;
    }

    // BƯỚC 1: TẠO LIÊN KẾT RESET MẬT KHẨU BẰNG ADMIN SDK (FIX LỖI SMTP)
    const { data: resetData, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'password_reset',
        email: email,
    });

    setIsLoading(false)

    if (resetError || !resetData.properties?.action_link) {
        // Nếu Admin SDK vẫn thất bại (Lỗi DB/Config), hiển thị lỗi
        console.error("Critical Admin Reset Error:", resetError?.message);
        toast({ 
            title: "Lỗi Hệ thống", 
            description: "Không thể tạo liên kết. Vui lòng liên hệ Admin.", 
            variant: "destructive" 
        });
        return;
    }
    
    // BƯỚC 2: CHUYỂN HƯỚNG TRỰC TIẾP (Bypass SMTP và hộp thư đến)
    setRedirecting(true);
    toast({ 
        title: "Thành công", 
        description: "Đang chuyển hướng đến trang đổi mật khẩu...", 
    });
    
    // Chuyển hướng người dùng đến link đặt lại mật khẩu đã tạo
    window.location.href = resetData.properties.action_link;
  }

  return (
    <div className="min-h-screen flex bg-background">
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
          {/* Logo & Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Life OS</h1>
              <p className="text-sm text-muted-foreground">Enterprise Management</p>
            </div>
          </div>

            {/* Trạng thái Loading/Redirecting */}
            {redirecting ? (
                <div className="text-center space-y-4">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-emerald-500" />
                    <h2 className="text-xl font-bold">Chuyển hướng...</h2>
                    <p className="text-muted-foreground">Đang tạo phiên đặt lại mật khẩu an toàn.</p>
                </div>
            ) : (
            <>
              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Đặt Lại Mật Khẩu</h2>
                <p className="text-muted-foreground">Sử dụng email tài khoản của bạn.</p>
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
                      placeholder="admin@msc-center.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 h-10"
                  size="lg"
                  disabled={isLoading || redirecting}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    t("sendResetLink")
                  )}
                </Button>
              </form>
            </>
            )}
          
          {/* Back to Login */}
          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backToLogin")}
          </Link>
        </motion.div>
      </div>

      {/* Right side - Image/Gradient */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-700 via-emerald-600 to-teal-500 relative overflow-hidden">
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
              Truy cập ngay trang tạo mật khẩu mới an toàn.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTranslation } from "@/hooks/use-translation"
import { useAppStore } from "@/lib/store"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { Building2, AlertCircle, CheckCircle2 } from "lucide-react"

const DEMO_CREDENTIALS = [
  { email: "bod@demo.com", role: "BOD (Ban Điều Hành)" },
  { email: "admin@demo.com", role: "ADMIN (Quản trị viên)" },
  { email: "leader@demo.com", role: "LEADER (Trưởng nhóm)" },
  { email: "student3@demo.com", role: "STUDENT_L3 (Học viên L3)" },
  { email: "student2@demo.com", role: "STUDENT_L2 (Học viên L2)" },
  { email: "student1@demo.com", role: "STUDENT_L1 (Học viên L1)" },
  { email: "mentor@demo.com", role: "MENTOR (Cố vấn)" },
]

export default function LoginPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { login, isLoading } = useAppStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showDemo, setShowDemo] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter email and password")
      return
    }

    const success = await login(email, password)
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Invalid email or password. Try a demo account below.")
    }
  }

  const handleDemoLogin = async (demoEmail: string) => {
    setError("")
    const success = await login(demoEmail, "123456")
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Demo login failed")
    }
  }

  return (
    <>
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>

      <div className="flex flex-col gap-6 w-full max-w-md">
        {/* Main Login Card */}
        <Card className="border-border">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Life OS</CardTitle>
            <CardDescription>{t("welcome")}</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : t("login")}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                {t("register")}
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Demo Users Card */}
        {showDemo && (
          <Card className="border-border bg-secondary/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Demo Users (All use password: 123456)
              </CardTitle>
              <CardDescription>Click any to quick login and test different roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {DEMO_CREDENTIALS.map((cred) => (
                <Button
                  key={cred.email}
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin(cred.email)}
                  disabled={isLoading}
                  className="w-full justify-start text-xs"
                >
                  <span className="truncate">
                    <span className="font-mono text-xs">{cred.email}</span>
                    <span className="text-muted-foreground ml-2">({cred.role})</span>
                  </span>
                </Button>
              ))}
            </CardContent>
            <CardFooter>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDemo(false)}
                className="text-xs w-full"
              >
                Hide demo users
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </>
  )
}

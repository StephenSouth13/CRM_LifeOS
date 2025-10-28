"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { Building2 } from "lucide-react"

export default function LoginPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { login } = useAppStore()
  const { toast } = useToast()
  const [email, setEmail] = useState("admin@hrm.com") // Pre-fill for convenience
  const [password, setPassword] = useState("123456") // Pre-fill for convenience
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const user = await login({ email })

      if (user) {
        toast({
          title: t("loginSuccess"),
          description: `${t("welcomeBack")}, ${user.name}`,
        })
        router.push("/dashboard")
      } else {
        setError(t("invalidCredentials"))
        toast({
          title: t("loginFailed"),
          description: t("invalidCredentials"),
          variant: "destructive",
        })
      }
    } catch (err) {
      setError(t("loginError"))
      toast({
        title: t("error"),
        description: t("loginError"),
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>

      <Card className="w-full max-w-sm border-border">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Life OS</CardTitle>
          <CardDescription>{t("welcomeBackDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("password")}</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              {t("login")}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            {t("noAccount")}{" "}
            <Link href="/auth/register" className="font-semibold text-primary hover:underline">
              {t("registerNow")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </>
  )
}

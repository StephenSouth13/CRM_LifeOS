"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "@/hooks/use-translation"
import { useAppStore } from "@/lib/store"
import { Monitor, Moon, Sun } from "lucide-react"

export function AppearanceSettings() {
  const { t } = useTranslation()
  const { theme, setTheme } = useAppStore()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("appearance")}</CardTitle>
          <CardDescription>Customize how Life OS looks and feels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>{t("theme")}</Label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                  theme === "light" ? "border-primary bg-accent" : "border-border hover:bg-accent/50"
                }`}
              >
                <Sun className="h-5 w-5" />
                <span className="text-sm font-medium">{t("lightMode")}</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                  theme === "dark" ? "border-primary bg-accent" : "border-border hover:bg-accent/50"
                }`}
              >
                <Moon className="h-5 w-5" />
                <span className="text-sm font-medium">{t("darkMode")}</span>
              </button>
              <button className="flex flex-col items-center gap-2 rounded-lg border-2 border-border p-4 transition-colors hover:bg-accent/50">
                <Monitor className="h-5 w-5" />
                <span className="text-sm font-medium">System</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">{t("language")}</Label>
            <Select defaultValue="vi">
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vi">Tiếng Việt</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("general")}</CardTitle>
          <CardDescription>General preferences and settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="timezone">{t("timezone")}</Label>
            <Select defaultValue="utc+7">
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc+7">(UTC+7) Bangkok, Hanoi, Jakarta</SelectItem>
                <SelectItem value="utc+8">(UTC+8) Beijing, Singapore</SelectItem>
                <SelectItem value="utc+9">(UTC+9) Tokyo, Seoul</SelectItem>
                <SelectItem value="utc-5">(UTC-5) New York</SelectItem>
                <SelectItem value="utc-8">(UTC-8) Los Angeles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateFormat">{t("dateFormat")}</Label>
            <Select defaultValue="dd/mm/yyyy">
              <SelectTrigger id="dateFormat">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeFormat">{t("timeFormat")}</Label>
            <Select defaultValue="24h">
              <SelectTrigger id="timeFormat">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                <SelectItem value="24h">24-hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// D:\CRM\CRM_LifeOS\app\layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import { PersistentMediaPlayer } from "@/components/persistent-media-player"
import "./globals.css"

export const metadata: Metadata = {
  title: "Life OS - Enterprise Life Management System",
  description: "Professional business and life management platform",
  generator: "quachthanhlong",
  applicationName: "Life OS",
  keywords: [
    "Life OS",
    "CRM",
    "AI",
    "Business Management",
    "Productivity",
    "Enterprise",
    "Life Management",
    "Task Management",
    "Project Management",
    "Team Collaboration",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  authors: [{ name: "quachthanhlong", url: "https://quachthanhlong.com" }],
  colorScheme: "dark",
  openGraph: {
    title: "Life OS - Enterprise Life Management System",
    description: "Professional business and life management platform",
    url: "https://lifeos.vercel.app",
    siteName: "Life OS",
    images: [
      {
        url: "https://lifeos.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Life OS",
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Life OS - Enterprise Life Management System",
    description: "Professional business and life management platform",
    images: ["https://lifeos.vercel.app/og-image.png"],
    creator: "@quachthanhlong",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* thêm suppressHydrationWarning vào <body> để tránh mismatch extension */}
      <body
        suppressHydrationWarning
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}
      >
        <ThemeProvider>
          {/* Suspense giúp tránh render lệch khi streaming */}
          <Suspense fallback={null}>{children}</Suspense>
          <PersistentMediaPlayer />
          <Toaster />
        </ThemeProvider>

        {/* Analytics đặt ngoài provider để tránh gây hydration lệch */}
        <Analytics />
      </body>
    </html>
  )
}

import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication - Life OS",
  description: "Sign in to your Life OS account",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

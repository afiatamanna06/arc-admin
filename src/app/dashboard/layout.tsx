"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import type React from "react"
import AdminShell from "@/components/admin/admin-shell"

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Simple client guard
    const isAuthed = typeof window !== "undefined" && localStorage.getItem("admin-auth") === "true"
    if (!isAuthed) {
      router.replace("/login")
    }
  }, [router, pathname])

  return <AdminShell>{children}</AdminShell>
}

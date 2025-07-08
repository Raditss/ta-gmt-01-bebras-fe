"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"
import { AdminNav } from "@/components/layout/Nav/admin-nav"
import { UserRole } from "@/types/user-role"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== UserRole.ADMIN) {
      router.replace("/login")
    }
  }, [isAuthenticated, user, router])

  return (
    <>
      <AdminNav />
      <main>{children}</main>
    </>
  )
}
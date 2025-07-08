"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"
import { TeacherNav } from "@/components/layout/Nav/teacher-nav"
import { UserRole } from "@/types/user-role"

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== UserRole.TEACHER) {
      router.replace("/login")
    }
  }, [isAuthenticated, user, router])

  return (
    <>
      <TeacherNav />
      <main>{children}</main>
    </>
  )
}
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"
import { StudentNav } from "@/components/layout/Nav/student-nav"
import { UserRole } from "@/types/user-role"

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== UserRole.STUDENT) {
      router.replace("/login")
    }
  }, [isAuthenticated, user, router])

  return (
    <>
      <StudentNav />
      <div className="flex flex-row min-h-screen bg-gray-100">
        <main>{children}</main>
      </div>
    </>
  )
}
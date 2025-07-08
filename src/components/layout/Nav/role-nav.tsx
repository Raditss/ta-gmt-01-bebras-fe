import { StudentNav } from "./student-nav"
import { TeacherNav } from "./teacher-nav"
import { AdminNav } from "./admin-nav"
import type { User } from "@/store/auth.store"

interface RoleNavProps {
  user: User | null
}

export function RoleNav({ user }: RoleNavProps) {
  if (!user) return null

  switch (user.role) {
    case "STUDENT":
      return <StudentNav />
    case "TEACHER":
      return <TeacherNav />
    case "ADMIN":
      return <AdminNav />
    default:
      return null
  }
} 
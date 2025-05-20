import Link from "next/link"

export function TeacherNav() {
  return (
    <>
      <Link href="/problems" className="font-medium">
        Problems
      </Link>
      <Link href="/leaderboard" className="font-medium">
        Leaderboard
      </Link>
      <Link href="/manage-students" className="font-medium">
        Manage Students
      </Link>
    </>
  )
} 
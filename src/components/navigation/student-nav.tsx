import Link from "next/link"

export function StudentNav() {
  return (
    <>
      <Link href="/problems" className="font-medium">
        Problems
      </Link>
      <Link href="/leaderboard" className="font-medium">
        Leaderboard
      </Link>
    </>
  )
} 
import Link from "next/link"

export function TeacherNav() {
  return (
    <>
      <Link href="/problems" className="font-medium">
        Problems
      </Link>
      <Link href="/add-problem" className="font-medium">
        Add Problem
      </Link>
      <Link href="/submit-question-type" className="font-medium">
        Submit Question Type
      </Link>
    </>
  )
} 
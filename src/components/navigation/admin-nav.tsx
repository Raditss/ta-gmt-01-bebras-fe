import Link from "next/link"

export function AdminNav() {
  return (
    <>
      <Link href="/manage-teachers" className="font-medium">
        Manage Teachers
      </Link>
      <Link href="/admin" className="font-medium">
        Admin Panel
      </Link>
    </>
  )
} 
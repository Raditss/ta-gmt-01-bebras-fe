"use client"

import { useEffect, useState } from "react"
import { MainNavbar } from "@/components/main-navbar"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, UserPlus, UserMinus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ManageStudentsPage() {
  const [mounted, setMounted] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // If not authenticated or not authorized, redirect to login
    if (mounted && (!isAuthenticated || (user?.role !== "TEACHER" && user?.role !== "ADMIN"))) {
      router.push("/login")
    }
  }, [isAuthenticated, mounted, router, user?.role])

  // Show nothing during SSR or if not authenticated/authorized
  if (!mounted || !isAuthenticated || (user?.role !== "TEACHER" && user?.role !== "ADMIN")) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MainNavbar />

      {/* Main content */}
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <UserPlus className="h-8 w-8 text-[#F8D15B]" />
              <h1 className="text-2xl font-bold">Manage Students</h1>
            </div>
            <Button className="bg-[#F8D15B] text-black hover:bg-[#E8C14B]">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Search students..." className="pl-8" />
          </div>

          <div className="grid gap-4">
            {/* Sample student cards - replace with actual data */}
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={`Student ${i}`} />
                        <AvatarFallback>ST{i}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">Student {i}</h3>
                        <p className="text-sm text-gray-500">student{i}@example.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        View Progress
                      </Button>
                      <Button variant="destructive" size="sm">
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
} 
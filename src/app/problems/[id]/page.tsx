"use client"

import { useEffect, useState } from "react"
import { MainNavbar } from "@/components/main-navbar"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Award, User } from "lucide-react"
import Link from "next/link"

export default function ProblemDetailPage({ params }: { params: { id: string } }) {
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { id } = params

  useEffect(() => {
    setMounted(true)
    // If not authenticated, redirect to login
    if (mounted && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, mounted, router])

  // Show nothing during SSR or if not authenticated
  if (!mounted || !isAuthenticated) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MainNavbar />

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/problems">
              <Button variant="ghost" className="pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Problems
              </Button>
            </Link>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="outline" className="bg-gray-100">
                  Cipher
                </Badge>
                <Badge className="bg-green-100 text-green-800">Easy</Badge>
              </div>
              <CardTitle className="text-2xl">Problem #{id}: Caesar Cipher Implementation</CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4 text-gray-500" />
                  <span className="text-sm">CryptoGenius</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-gray-500" />
                  <span className="text-sm">Estimated time: 30 mins</span>
                </div>
                <div className="flex items-center">
                  <Award className="mr-1 h-4 w-4 text-gray-500" />
                  <span className="text-sm">10 points</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <h3>Problem Description</h3>
                <p>
                  This is a placeholder for the problem description. Another developer will implement the full problem
                  page with code editor, test cases, and submission functionality.
                </p>
                <p>
                  The Caesar Cipher is one of the earliest and simplest forms of encryption. It is a substitution cipher
                  where each letter in the plaintext is shifted a certain number of places down the alphabet.
                </p>

                <h3>Task</h3>
                <p>
                  Implement a function that encrypts a given string using the Caesar Cipher technique with a specified
                  shift value.
                </p>

                <h3>Example</h3>
                <pre>
                  <code>Input: "HELLO", shift=3 Output: "KHOOR"</code>
                </pre>

                <h3>Constraints</h3>
                <ul>
                  <li>The input string will only contain uppercase letters (A-Z) and spaces.</li>
                  <li>Spaces should remain unchanged.</li>
                  <li>The shift value will be between 1 and 25.</li>
                </ul>

                <Link href={`/problems/${id}/solve`}>
                  <Button variant="default" className="pl-0">
                    Solve!
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-gray-100 py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} CodeLeaf. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

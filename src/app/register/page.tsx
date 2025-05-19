"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Leaf, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { MainNavbar } from "@/components/main-navbar"
import { useAuth } from "@/lib/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { register, isAuthenticated } = useAuth()

  useEffect(() => {
    setMounted(true)
    // If already authenticated, redirect to problems page
    if (isAuthenticated) {
      router.push("/problems")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mounted) return

    // Validate form
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Try to register with provided details
      const success = await register(email, username, password)

      if (success) {
        router.push("/problems")
      } else {
        setError("Username or email already exists")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar />
      <div className="flex flex-1">
        {/* Left side - Illustration */}
        <div className="hidden md:block md:w-1/2 bg-[#4A6670] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=600')] bg-no-repeat bg-cover opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4 relative">
              {/* This would be your bird/toucan illustration */}
              <div className="absolute left-1/4 top-1/4 w-32 h-32 bg-[#6A8CAF] rounded-full"></div>
              <div className="absolute left-1/3 top-1/3 w-24 h-24 bg-[#F8D15B] rounded-full"></div>
              <div className="absolute right-1/4 bottom-1/4 w-40 h-20 bg-[#E67E22] rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Right side - Register form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-2">
                <Leaf className="h-10 w-10 text-[#F8D15B]" />
              </div>
              <h1 className="text-2xl font-bold text-[#F8D15B]">Register</h1>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full bg-[#F8D15B] text-black hover:bg-[#E8C14B]" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Register"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="text-[#F8D15B] hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

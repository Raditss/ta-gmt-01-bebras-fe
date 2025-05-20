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

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth()

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

    clearError()
    const success = await login(username, password)

    if (success) {
      router.push("/problems")
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

        {/* Right side - Login form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-2">
                <Leaf className="h-10 w-10 text-[#F8D15B]" />
              </div>
              <h1 className="text-2xl font-bold text-[#F8D15B]">Login</h1>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username or Email
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Your username or email"
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

              <Button type="submit" className="w-full bg-[#F8D15B] text-black hover:bg-[#E8C14B]" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-500">
                Don't have an account?{" "}
                <Link href="/register" className="text-[#F8D15B] hover:underline">
                  Register here
                </Link>
              </p>
              <p className="mt-2">
                <Link href="#" className="text-[#F8D15B] hover:underline">
                  Forgot password?
                </Link>
              </p>
            </div>

            {mounted && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-sm mb-2">Demo Accounts</h3>
                <div className="space-y-2 text-xs text-gray-600">
                  <div>
                    <p className="font-medium">Student Account:</p>
                    <p>Username: <span className="font-mono">johndoe</span></p>
                    <p>Password: <span className="font-mono">password123</span></p>
                  </div>
                  <div>
                    <p className="font-medium">Teacher Account:</p>
                    <p>Username: <span className="font-mono">teacher</span></p>
                    <p>Password: <span className="font-mono">password123</span></p>
                  </div>
                  <div>
                    <p className="font-medium">Admin Account:</p>
                    <p>Username: <span className="font-mono">admin</span></p>
                    <p>Password: <span className="font-mono">password123</span></p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

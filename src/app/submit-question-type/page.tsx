"use client"

import { useEffect, useState } from "react"
import { MainNavbar } from "@/components/main-navbar"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"

export default function SubmitQuestionTypePage() {
  const [mounted, setMounted] = useState(false)
  const [name, setName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // If not authenticated or not authorized, redirect to login
    if (mounted && (!isAuthenticated || user?.role !== "TEACHER")) {
      router.push("/login")
    }
  }, [isAuthenticated, mounted, router, user?.role])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!name.trim()) {
      setError("Please enter a question type name")
      return
    }

    if (!file) {
      setError("Please select a file")
      return
    }

    // Here you would typically upload the file and submit the question type
    // For now, we'll just simulate a successful submission
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess(true)
      setName("")
      setFile(null)
    } catch (err) {
      setError("Failed to submit question type. Please try again.")
    }
  }

  // Show nothing during SSR or if not authenticated/authorized
  if (!mounted || !isAuthenticated || user?.role !== "TEACHER") {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Submit New Question Type</CardTitle>
            <CardDescription>
              Upload a new question type template and provide a name for it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Question Type Name</Label>
                <Input
                  id="name"
                  placeholder="Enter a name for this question type"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Question Type Template</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".json,.yaml,.yml"
                  />
                  <label
                    htmlFor="file"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {file ? file.name : "Click to upload or drag and drop"}
                    </span>
                    <span className="text-xs text-gray-500">
                      JSON or YAML files only
                    </span>
                  </label>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <AlertDescription>
                    Question type submitted successfully!
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full">
                Submit Question Type
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 
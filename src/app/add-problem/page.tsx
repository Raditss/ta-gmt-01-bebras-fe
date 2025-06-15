"use client"

import { useEffect, useState } from "react"
import { MainNavbar } from "@/components/main-navbar"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Mock question types - in a real app, these would come from an API
const questionTypes = [
  { id: "multiple-choice", name: "Multiple Choice" },
  { id: "true-false", name: "True/False" },
  { id: "short-answer", name: "Short Answer" },
  { id: "coding", name: "Coding Problem" },
  { id: "cfg", name: "Context-Free Grammar" },
]

export default function AddProblemPage() {
  const [mounted, setMounted] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [points, setPoints] = useState("100")
  const [estimatedTime, setEstimatedTime] = useState("30")
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!title.trim()) {
      setError("Please enter a problem title")
      return
    }

    if (!description.trim()) {
      setError("Please enter a problem description")
      return
    }

    if (!selectedType) {
      setError("Please select a question type")
      return
    }

    if (!difficulty) {
      setError("Please select a difficulty level")
      return
    }

    if (!points || parseInt(points) <= 0) {
      setError("Please enter valid points")
      return
    }

    if (!estimatedTime || parseInt(estimatedTime) <= 0) {
      setError("Please enter valid estimated time")
      return
    }

    // Handle CFG question type differently
    if (selectedType === "cfg") {
      // Create URL search params with form data
      const params = new URLSearchParams({
        title: title.trim(),
        description: description.trim(),
        difficulty,
        category: questionTypes.find(qt => qt.id === selectedType)?.name || selectedType,
        points,
        estimatedTime,
        author: user?.name || 'Unknown Author'
      });

      const targetUrl = `/add-problem/create/cfg/new?${params.toString()}`;

      // Navigate to CFG creation page with form data
      router.push(targetUrl);
      return;
    }

    // For other question types, show not implemented message
    setError(`Question type "${questionTypes.find(qt => qt.id === selectedType)?.name}" is not yet implemented. Please try Context-Free Grammar for now.`);
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
            <CardTitle>Add New Problem</CardTitle>
            <CardDescription>
              Create a new problem and assign it to a specific question type.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Problem Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a title for this problem"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Problem Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter the problem description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="min-h-[150px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Question Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a question type" />
                  </SelectTrigger>
                  <SelectContent>
                    {questionTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    min="1"
                    placeholder="100"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedTime">Estimated Time (min)</Label>
                  <Input
                    id="estimatedTime"
                    type="number"
                    min="1"
                    placeholder="30"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    required
                  />
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
                    Problem added successfully!
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full">
                Continue to Question Creation
              </Button>
              
              {/* Debug: Direct link to fresh CFG creator */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Debug: Test fresh question creation</p>
                                 <Button 
                   type="button" 
                   variant="outline" 
                   className="w-full"
                   onClick={() => router.push('/add-problem/create/cfg/new')}
                 >
                   Create Fresh CFG Question (No Form Data)
                 </Button>
                 
                 {!isAuthenticated && (
                   <Button 
                     type="button" 
                     variant="outline" 
                     className="w-full mt-2"
                     onClick={() => router.push('/login')}
                   >
                     Login Required for Question Creation
                   </Button>
                 )}
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 
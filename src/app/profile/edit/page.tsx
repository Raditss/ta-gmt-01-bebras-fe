"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNavbar } from "@/components/main-navbar"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditProfilePage() {
  const [mounted, setMounted] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skills: "",
    github: "",
    linkedin: "",
    twitter: "",
  })

  useEffect(() => {
    setMounted(true)
    // If not authenticated, redirect to login
    if (mounted && !isAuthenticated) {
      router.push("/login")
    }
    // Initialize form data with user data
    if (user) {
      setFormData({
        name: user.name || "",
        bio: "Passionate developer focused on algorithms and data structures. Currently learning Rust and exploring systems programming.",
        skills: "Python, JavaScript, Rust, Algorithms",
        github: "",
        linkedin: "",
        twitter: "",
      })
    }
  }, [isAuthenticated, mounted, router, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement profile update logic
    // Form submission logic would go here
    router.push("/profile")
  }

  // Show nothing during SSR or if not authenticated
  if (!mounted || !isAuthenticated) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MainNavbar />

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link href="/profile">
              <Button variant="ghost" className="pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Profile
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="skills">Skills</Label>
                    <Input
                      id="skills"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      placeholder="Enter your skills (comma separated)"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Social Links</h3>
                    <div>
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        value={formData.github}
                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        value={formData.twitter}
                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Link href="/profile">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-gray-100 py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Solvio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
} 
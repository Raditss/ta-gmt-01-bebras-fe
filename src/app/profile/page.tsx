"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Settings, Award, Code, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MainNavbar } from "@/components/layout/Nav/main-navbar"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {useAuth} from "@/hooks/useAuth";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    if (mounted && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, mounted, router])

  if (!mounted || !isAuthenticated || !user) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <MainNavbar />

      {/* Main content */}
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Profile header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt={user.username} />
                <AvatarFallback className="text-2xl">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h1 className="text-2xl font-bold">{user.username}</h1>
                  <Badge className="bg-[#F8D15B] text-black hover:bg-[#E8C14B] self-center md:self-auto">Gold</Badge>
                </div>
                <p className="text-gray-600 mt-1">Joined May 2023</p>
                <p className="mt-2 max-w-2xl">
                  Passionate developer focused on algorithms and data structures. Currently learning Rust and exploring
                  systems programming.
                </p>

                <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                  <Badge variant="outline" className="bg-gray-100">
                    Python
                  </Badge>
                  <Badge variant="outline" className="bg-gray-100">
                    JavaScript
                  </Badge>
                  <Badge variant="outline" className="bg-gray-100">
                    Rust
                  </Badge>
                  <Badge variant="outline" className="bg-gray-100">
                    Algorithms
                  </Badge>
                </div>
              </div>

              <Button variant="outline" size="sm" className="flex items-center gap-1" asChild>
                <Link href="/profile/edit">
                  <Settings className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-[#F8D15B]">{user.points}</p>
                <p className="text-sm text-gray-600">Total Points</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-[#F8D15B]">{user.problemsSolved}</p>
                <p className="text-sm text-gray-600">Problems Solved</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-[#F8D15B]">15</p>
                <p className="text-sm text-gray-600">Day Streak</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-[#F8D15B]">#{user.rank}</p>
                <p className="text-sm text-gray-600">Global Rank</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="progress">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="progress" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>Progress</span>
              </TabsTrigger>
              <TabsTrigger value="solutions" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span>Solutions</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Activity</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="progress">
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Problem Solving Progress</CardTitle>
                    <CardDescription>
                      Your progress across different problem categories and difficulty levels
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Cipher Problems</span>
                          <span className="text-sm text-gray-500">8/12</span>
                        </div>
                        <Progress value={66} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Binary Tree Problems</span>
                          <span className="text-sm text-gray-500">5/10</span>
                        </div>
                        <Progress value={50} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Balanced Problems</span>
                          <span className="text-sm text-gray-500">10/15</span>
                        </div>
                        <Progress value={67} className="h-2" />
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-4">By Difficulty</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-green-50 p-4 rounded-lg text-center">
                            <p className="text-xl font-bold text-green-600">10/12</p>
                            <p className="text-sm text-gray-600">Easy</p>
                          </div>
                          <div className="bg-yellow-50 p-4 rounded-lg text-center">
                            <p className="text-xl font-bold text-yellow-600">8/15</p>
                            <p className="text-sm text-gray-600">Medium</p>
                          </div>
                          <div className="bg-red-50 p-4 rounded-lg text-center">
                            <p className="text-xl font-bold text-red-600">5/10</p>
                            <p className="text-sm text-gray-600">Hard</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>Badges and achievements you&apos;ve earned</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-[#F8D15B] rounded-full flex items-center justify-center mb-2">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <p className="font-medium text-sm">First Blood</p>
                        <p className="text-xs text-gray-500">First problem solved</p>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-[#F8D15B] rounded-full flex items-center justify-center mb-2">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <p className="font-medium text-sm">Streak Master</p>
                        <p className="text-xs text-gray-500">10 day streak</p>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <p className="font-medium text-sm">Cipher Expert</p>
                        <p className="text-xs text-gray-500">Locked</p>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <p className="font-medium text-sm">Hard Hitter</p>
                        <p className="text-xs text-gray-500">Locked</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="solutions">
              <Card>
                <CardHeader>
                  <CardTitle>Your Solutions</CardTitle>
                  <CardDescription>Recent problems you've solved</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">Caesar Cipher Implementation</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              Easy
                            </Badge>
                            <span className="text-xs text-gray-500">Solved 3 days ago</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Solution
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent actions and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-[#F8D15B] rounded-full flex items-center justify-center flex-shrink-0">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Earned 5 points</p>
                        <p className="text-sm text-gray-600">Solved &quot;Binary Tree Traversal&quot; problem</p>
                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-[#F8D15B] rounded-full flex items-center justify-center flex-shrink-0">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Earned badge</p>
                        <p className="text-sm text-gray-600">Achieved &quot;Streak Master&quot; for 10 day streak</p>
                        <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-[#F8D15B] rounded-full flex items-center justify-center flex-shrink-0">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Earned 10 points</p>
                        <p className="text-sm text-gray-600">Solved "Advanced Encryption Standard" problem</p>
                        <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Solvio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, TrendingUp, Target } from "lucide-react"

const MOCK_LEADERBOARD = [
  { rank: 1, name: "Radit", solved: 245, points: 2350, badges: 12, streak: 28, badge: "Expert" },
  { rank: 2, name: "Bayu", solved: 198, points: 2120, badges: 10, streak: 15, badge: "Advanced" },
  { rank: 3, name: "Rere", solved: 187, points: 1980, badges: 9, streak: 22, badge: "Advanced" },
  { rank: 4, name: "Naufal", solved: 165, points: 1850, badges: 10, streak: 12, badge: "Intermediate" },
  { rank: 5, name: "Sekar", solved: 156, points: 1790, badges: 8, streak: 8, badge: "Intermediate" },
  { rank: 6, name: "Ardhi", solved: 142, points: 1720, badges: 7, streak: 18, badge: "Intermediate" },
  { rank: 7, name: "Maya", solved: 134, points: 1650, badges: 7, streak: 5, badge: "Beginner" },
  { rank: 8, name: "James", solved: 128, points: 1540, badges: 6, streak: 14, badge: "Beginner" },
]

const getBadgeColor = (badge: string) => {
  switch (badge) {
    case "Expert":
      return "bg-purple-100 text-purple-700"
    case "Advanced":
      return "bg-blue-100 text-blue-700"
    case "Intermediate":
      return "bg-green-100 text-green-700"
    case "Beginner":
      return "bg-yellow-100 text-yellow-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-6 h-6 text-yellow-500" />
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />
    case 3:
      return <Award className="w-6 h-6 text-amber-600" />
    default:
      return <div className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">#{rank}</div>
  }
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("all-time")

  const topThree = MOCK_LEADERBOARD.slice(0, 3)
  const remainingUsers = MOCK_LEADERBOARD.slice(3)

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Leaderboard</h1>
          <p className="text-gray-600">See how you rank against other computational thinkers in the community.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">1,247</div>
                <div className="text-sm text-gray-600">Total Players</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">156</div>
                <div className="text-sm text-gray-600">Your Rank</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">1,285</div>
                <div className="text-sm text-gray-600">Your Points</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">12</div>
                <div className="text-sm text-gray-600">Your Badges</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Leaderboard */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Global Leaderboard
                </CardTitle>
                <CardDescription>Rankings based on total points earned from solving problems</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all-time">All Time</TabsTrigger>
                    <TabsTrigger value="monthly">This Month</TabsTrigger>
                    <TabsTrigger value="weekly">This Week</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all-time" className="mt-6">
                    {/* Podium Section */}
                    <div className="mb-8">
                      <div className="flex items-end justify-center gap-4 mb-8">
                        {/* Second Place */}
                        <div className="flex flex-col items-center">
                          <Avatar className="w-16 h-16 mb-3 ring-4 ring-blue-400">
                            <AvatarImage src="/placeholder.svg" alt={topThree[1]?.name} />
                            <AvatarFallback className="text-lg font-bold">
                              {topThree[1]?.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                            {topThree[1]?.points} Points
                          </div>
                          <div className="text-lg font-bold text-gray-800 mb-2">
                            {topThree[1]?.name}
                          </div>
                          <div className="flex gap-3 mb-4">
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Solved</div>
                              <div className="font-bold text-gray-800">{topThree[1]?.solved}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Streak</div>
                              <div className="font-bold text-orange-500">{topThree[1]?.streak}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Badges</div>
                              <div className="font-bold text-yellow-500">{topThree[1]?.badges}</div>
                            </div>
                          </div>
                          <div className="bg-blue-500 text-white w-24 h-20 rounded-t-lg flex items-center justify-center">
                            <span className="text-3xl font-bold">2</span>
                          </div>
                        </div>

                        {/* First Place */}
                        <div className="flex flex-col items-center relative -top-6">
                          <div className="text-4xl mb-2">👑</div>
                          <Avatar className="w-20 h-20 mb-3 ring-4 ring-yellow-400">
                            <AvatarImage src="/placeholder.svg" alt={topThree[0]?.name} />
                            <AvatarFallback className="text-xl font-bold">
                              {topThree[0]?.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                            {topThree[0]?.points} Points
                          </div>
                          <div className="text-xl font-bold text-gray-800 mb-2">
                            {topThree[0]?.name}
                          </div>
                          <div className="flex gap-3 mb-4">
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Solved</div>
                              <div className="font-bold text-gray-800">{topThree[0]?.solved}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Streak</div>
                              <div className="font-bold text-orange-500">{topThree[0]?.streak}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Badges</div>
                              <div className="font-bold text-yellow-500">{topThree[0]?.badges}</div>
                            </div>
                          </div>
                          <div className="bg-red-500 text-white w-24 h-28 rounded-t-lg flex items-center justify-center">
                            <span className="text-4xl font-bold">1</span>
                          </div>
                        </div>

                        {/* Third Place */}
                        <div className="flex flex-col items-center">
                          <Avatar className="w-16 h-16 mb-3 ring-4 ring-purple-400">
                            <AvatarImage src="/placeholder.svg" alt={topThree[2]?.name} />
                            <AvatarFallback className="text-lg font-bold">
                              {topThree[2]?.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                            {topThree[2]?.points} Points
                          </div>
                          <div className="text-lg font-bold text-gray-800 mb-2">
                            {topThree[2]?.name}
                          </div>
                          <div className="flex gap-3 mb-4">
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Solved</div>
                              <div className="font-bold text-gray-800">{topThree[2]?.solved}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Streak</div>
                              <div className="font-bold text-orange-500">{topThree[2]?.streak}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Badges</div>
                              <div className="font-bold text-yellow-500">{topThree[2]?.badges}</div>
                            </div>
                          </div>
                          <div className="bg-purple-500 text-white w-24 h-16 rounded-t-lg flex items-center justify-center">
                            <span className="text-2xl font-bold">3</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rest of Leaderboard */}
                    <div className="space-y-4">
                      {remainingUsers.map((user) => (
                        <div
                          key={user.rank}
                          className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8">
                              {getRankIcon(user.rank)}
                            </div>
                            <Avatar className="w-10 h-10">
                              <AvatarImage src="/placeholder.svg" alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-gray-800">{user.name}</div>
                              <div className="text-sm text-gray-600">{user.solved} problems solved</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="text-sm text-gray-500">Points</div>
                              <div className="font-bold text-gray-800">{user.points.toLocaleString()}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-500">Streak</div>
                              <div className="font-bold text-orange-500">{user.streak} days</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-500">Badges</div>
                              <div className="font-bold text-yellow-500">{user.badges}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="monthly" className="mt-6">
                    <div className="text-center py-12 text-gray-500">
                      <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Monthly leaderboard data will be displayed here.</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="weekly" className="mt-6">
                    <div className="text-center py-12 text-gray-500">
                      <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Weekly leaderboard data will be displayed here.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Search, Trophy, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MainNavbar } from "@/components/main-navbar"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

// Mock leaderboard data
const MOCK_LEADERBOARD = [
  { rank: 1, name: "AlgoMaster", solved: 145, points: 2350, badges: 12 },
  { rank: 2, name: "CodeWizard", solved: 132, points: 2120, badges: 10 },
  { rank: 3, name: "ByteNinja", solved: 128, points: 1980, badges: 9 },
  { rank: 4, name: "DevGenius", solved: 120, points: 1850, badges: 8 },
  { rank: 5, name: "TechGuru", solved: 115, points: 1790, badges: 8 },
  { rank: 6, name: "ProgramPro", solved: 110, points: 1720, badges: 7 },
  { rank: 7, name: "LogicLord", solved: 105, points: 1650, badges: 7 },
  { rank: 8, name: "SyntaxSage", solved: 98, points: 1540, badges: 6 },
  { rank: 9, name: "BinaryBaron", solved: 95, points: 1490, badges: 6 },
  { rank: 10, name: "CipherSolver", solved: 90, points: 1420, badges: 5 },
]

export default function LeaderboardPage() {
  const [leaderboardView, setLeaderboardView] = useState("global")
  const [viewTitle, setViewTitle] = useState("Showing top performers worldwide")
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // If not authenticated, redirect to login
    if (mounted && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, mounted, router])

  const handleViewChange = (value: string) => {
    if (!mounted) return

    setLeaderboardView(value)

    // Update the title based on the selected view
    switch (value) {
      case "global":
        setViewTitle("Showing top performers worldwide")
        break
      case "monthly":
        setViewTitle("Showing top performers for May 2025")
        break
      case "weekly":
        setViewTitle("Showing top performers this week")
        break
      case "friends":
        setViewTitle("Showing your friends' rankings")
        break
      default:
        setViewTitle("Showing top performers worldwide")
    }
  }

  // Show nothing during SSR or if not authenticated
  if (!mounted || !isAuthenticated) {
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
              <Trophy className="h-8 w-8 text-[#F8D15B]" />
              <h1 className="text-2xl font-bold">Leaderboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search users..." className="pl-8" />
              </div>
              <Select value={leaderboardView} onValueChange={handleViewChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global Ranking</SelectItem>
                  <SelectItem value="monthly">Monthly Contest</SelectItem>
                  <SelectItem value="weekly">Weekly Challenge</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <div className="text-sm font-medium">{viewTitle}</div>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-center">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-center">Problems Solved</TableHead>
                  <TableHead className="text-center">Points</TableHead>
                  <TableHead className="text-right">Badges</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_LEADERBOARD.map((leaderboardUser) => (
                  <TableRow key={leaderboardUser.rank}>
                    <TableCell className="font-medium text-center">
                      {leaderboardUser.rank <= 3 ? (
                        <div className="flex justify-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              leaderboardUser.rank === 1
                                ? "bg-yellow-100 text-yellow-700"
                                : leaderboardUser.rank === 2
                                  ? "bg-gray-100 text-gray-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {leaderboardUser.rank}
                          </div>
                        </div>
                      ) : (
                        leaderboardUser.rank
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`/placeholder.svg?height=32&width=32&text=${leaderboardUser.name.charAt(0)}`}
                            alt={leaderboardUser.name}
                          />
                          <AvatarFallback>{leaderboardUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{leaderboardUser.name}</div>
                          <div className="text-xs text-gray-500">Member since 2023</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{leaderboardUser.solved}</TableCell>
                    <TableCell className="text-center font-medium">{leaderboardUser.points}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <div className="w-5 h-5 bg-[#F8D15B] rounded-full"></div>
                        <span>×{leaderboardUser.badges}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="p-4 bg-gray-50 border-t">
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="font-medium">Your rank:</span> #{user?.rank || "-"}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Points:</span> {user?.points || 0}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Problems solved:</span> {user?.problemsSolved || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} CodeLeaf. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

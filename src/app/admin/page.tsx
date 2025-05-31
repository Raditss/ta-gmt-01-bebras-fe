"use client"

import { useEffect, useState } from "react"
import { MainNavbar } from "@/components/main-navbar"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SubmissionsTable, type Submission } from "@/components/tables/submissions-table"

// Mock data for teacher submissions
const mockSubmissions: Submission[] = [
  {
    id: 1,
    teacherName: "Sarah Smith",
    questionTypeName: "Algorithm Complexity",
    submittedAt: "2024-03-15T10:30:00Z",
    status: "pending",
    fileUrl: "/templates/algorithm-complexity.json"
  },
  {
    id: 2,
    teacherName: "John Wilson",
    questionTypeName: "Data Structures",
    submittedAt: "2024-03-14T15:45:00Z",
    status: "approved",
    fileUrl: "/templates/data-structures.json"
  },
  {
    id: 3,
    teacherName: "Emily Brown",
    questionTypeName: "Graph Theory",
    submittedAt: "2024-03-13T09:15:00Z",
    status: "rejected",
    fileUrl: "/templates/graph-theory.json"
  }
]

export default function AdminPanelPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [submissions, setSubmissions] = useState(mockSubmissions)
  const [filterStatus, setFilterStatus] = useState("all")
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // If not authenticated or not authorized, redirect to login
    if (mounted && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/login")
    }
  }, [isAuthenticated, mounted, router, user?.role])

  const handleApprove = (id: number) => {
    setSubmissions(submissions.map(sub => 
      sub.id === id ? { ...sub, status: "approved" } : sub
    ))
  }

  const handleReject = (id: number) => {
    setSubmissions(submissions.map(sub => 
      sub.id === id ? { ...sub, status: "rejected" } : sub
    ))
  }

  const handleView = (fileUrl: string) => {
    window.open(fileUrl, '_blank')
  }

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, '_blank')
  }

  const filteredSubmissions = filterStatus === "all" 
    ? submissions 
    : submissions.filter(sub => sub.status === filterStatus)

  // Show nothing during SSR or if not authenticated/authorized
  if (!mounted || !isAuthenticated || user?.role !== "ADMIN") {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Problems</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">+8 new this week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Submissions Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45</div>
                  <p className="text-xs text-muted-foreground">+23% from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">-2 from last week</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div>
                      <p className="text-sm">New teacher registration: Sarah Smith</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="text-sm">New problem type submitted: Algorithm Complexity</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Question Type Submissions</CardTitle>
                    <CardDescription>
                      Review and manage teacher submissions for new question types
                    </CardDescription>
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Submissions</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <SubmissionsTable
                  submissions={filteredSubmissions}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onView={handleView}
                  onDownload={handleDownload}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage users and their roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>User management content will go here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system-wide settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Settings content will go here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
} 
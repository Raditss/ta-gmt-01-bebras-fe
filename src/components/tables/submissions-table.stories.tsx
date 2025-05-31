import type { Meta, StoryObj } from "@storybook/react"
import { SubmissionsTable } from "./submissions-table"

const meta: Meta<typeof SubmissionsTable> = {
  title: "Tables/SubmissionsTable",
  component: SubmissionsTable,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof SubmissionsTable>

const mockSubmissions = [
  {
    id: 1,
    teacherName: "Sarah Smith",
    questionTypeName: "Algorithm Complexity",
    submittedAt: "2024-03-15T10:30:00Z",
    status: "pending" as const,
    fileUrl: "/templates/algorithm-complexity.json"
  },
  {
    id: 2,
    teacherName: "John Wilson",
    questionTypeName: "Data Structures",
    submittedAt: "2024-03-14T15:45:00Z",
    status: "approved" as const,
    fileUrl: "/templates/data-structures.json"
  },
  {
    id: 3,
    teacherName: "Emily Brown",
    questionTypeName: "Graph Theory",
    submittedAt: "2024-03-13T09:15:00Z",
    status: "rejected" as const,
    fileUrl: "/templates/graph-theory.json"
  }
]

export const Default: Story = {
  args: {
    submissions: mockSubmissions,
    onApprove: (id) => console.log("Approve submission:", id),
    onReject: (id) => console.log("Reject submission:", id),
    onView: (fileUrl) => console.log("View file:", fileUrl),
    onDownload: (fileUrl) => console.log("Download file:", fileUrl),
  },
}

export const Empty: Story = {
  args: {
    submissions: [],
  },
}

export const PendingOnly: Story = {
  args: {
    submissions: mockSubmissions.filter(sub => sub.status === "pending"),
  },
}

export const ApprovedOnly: Story = {
  args: {
    submissions: mockSubmissions.filter(sub => sub.status === "approved"),
  },
}

export const RejectedOnly: Story = {
  args: {
    submissions: mockSubmissions.filter(sub => sub.status === "rejected"),
  },
} 
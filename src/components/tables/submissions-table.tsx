import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, Download, Eye, XCircle } from "lucide-react"

export interface Submission {
  id: number
  teacherName: string
  questionTypeName: string
  submittedAt: string
  status: "pending" | "approved" | "rejected"
  fileUrl: string
}

interface SubmissionsTableProps {
  submissions: Submission[]
  onApprove?: (id: number) => void
  onReject?: (id: number) => void
  onView?: (fileUrl: string) => void
  onDownload?: (fileUrl: string) => void
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200"
}

export function SubmissionsTable({
  submissions,
  onApprove,
  onReject,
  onView,
  onDownload
}: SubmissionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Teacher</TableHead>
          <TableHead>Question Type</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((submission) => (
          <TableRow key={submission.id}>
            <TableCell>{submission.teacherName}</TableCell>
            <TableCell>{submission.questionTypeName}</TableCell>
            <TableCell>
              {new Date(submission.submittedAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Badge
                className={statusColors[submission.status]}
              >
                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView?.(submission.fileUrl)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload?.(submission.fileUrl)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                {submission.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600"
                      onClick={() => onApprove?.(submission.id)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={() => onReject?.(submission.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 
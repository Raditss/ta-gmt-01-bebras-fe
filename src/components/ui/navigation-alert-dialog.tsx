"use client"

import * as React from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface NavigationAlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaveAndLeave: () => Promise<void>
  onLeaveWithoutSaving: () => void
  onCancel: () => void
}

export function NavigationAlertDialog({
  open,
  onOpenChange,
  onSaveAndLeave,
  onLeaveWithoutSaving,
  onCancel,
}: NavigationAlertDialogProps) {
  const [isSaving, setIsSaving] = React.useState(false)

  const handleSaveAndLeave = async () => {
    try {
      setIsSaving(true)
      await onSaveAndLeave()
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes. What would you like to do?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2">
          <Button
            variant="default"
            onClick={handleSaveAndLeave}
            disabled={isSaving}
            className="relative"
          >
            {isSaving && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Draft & Leave
          </Button>
          <Button
            variant="destructive"
            onClick={onLeaveWithoutSaving}
          >
            Leave Without Saving
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Stay on Page
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 
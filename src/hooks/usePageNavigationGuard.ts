"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface UsePageNavigationGuardProps {
  hasUnsavedChanges: boolean
  onSave?: () => Promise<void>
}

export function usePageNavigationGuard({ hasUnsavedChanges, onSave }: UsePageNavigationGuardProps) {
  const router = useRouter()
  const pendingNavigation = useRef<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  // Handle browser back/forward buttons and tab close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    // Handle browser back button
    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges) {
        // Prevent the navigation
        e.preventDefault()
        // Show confirmation dialog
        setShowDialog(true)
        // Push the current state back to maintain the URL
        window.history.pushState(null, '', window.location.pathname)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)

    // Push initial state to enable popstate handling
    window.history.pushState(null, '', window.location.pathname)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [hasUnsavedChanges])

  // Handle Next.js navigation attempts
  const handleNavigationAttempt = useCallback((url: string) => {
    if (hasUnsavedChanges) {
      pendingNavigation.current = url
      setShowDialog(true)
      return false
    }
    return true
  }, [hasUnsavedChanges])

  const handleSaveAndLeave = useCallback(async () => {
    if (onSave) {
      try {
        await onSave()
        setShowDialog(false)
        if (pendingNavigation.current) {
          router.push(pendingNavigation.current)
          pendingNavigation.current = null
        }
      } catch (error) {
        console.error('Failed to save:', error)
      }
    }
  }, [onSave, router])

  const handleLeaveWithoutSaving = useCallback(() => {
    setShowDialog(false)
    if (pendingNavigation.current) {
      router.push(pendingNavigation.current)
      pendingNavigation.current = null
    }
  }, [router])

  const handleStayOnPage = useCallback(() => {
    setShowDialog(false)
    pendingNavigation.current = null
  }, [])

  return {
    showDialog,
    setShowDialog,
    onSaveAndLeave: handleSaveAndLeave,
    onLeaveWithoutSaving: handleLeaveWithoutSaving,
    onStayOnPage: handleStayOnPage,
    handleNavigationAttempt
  }
} 
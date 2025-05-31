import { useCallback } from 'react'

interface UseNavigationProtectionProps {
  hasUnsavedChanges: boolean
  onSave?: () => Promise<void>
}

export function useNavigationProtection({ hasUnsavedChanges, onSave }: UseNavigationProtectionProps) {
  const handleBeforeNavigate = useCallback(async () => {
    if (hasUnsavedChanges) {
      return false // Prevent navigation, show dialog
    }
    return true // Allow navigation
  }, [hasUnsavedChanges])

  const handleSaveAndLeave = useCallback(async () => {
    if (onSave) {
      try {
        await onSave()
        return true // Navigation can proceed after successful save
      } catch (error) {
        console.error('Failed to save:', error)
        return false // Prevent navigation if save fails
      }
    }
    return true // No save needed, navigation can proceed
  }, [onSave])

  return {
    onBeforeNavigate: handleBeforeNavigate,
    onSaveAndLeave: handleSaveAndLeave
  }
} 
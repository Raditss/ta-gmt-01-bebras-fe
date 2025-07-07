"use client"

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { NavigationAlertDialog } from './navigation-alert-dialog'

interface ProtectedLinkProps {
  href: string
  className?: string
  children: React.ReactNode
  onBeforeNavigate?: () => Promise<boolean>
  onSaveAndLeave?: () => Promise<boolean>
}

export function ProtectedLink({
  href,
  className,
  children,
  onBeforeNavigate,
  onSaveAndLeave
}: ProtectedLinkProps) {
  const router = useRouter()
  const [showDialog, setShowDialog] = useState(false)
  const [pendingHref, setPendingHref] = useState<string | null>(null)

  const handleClick = useCallback(async (e: React.MouseEvent) => {
    // If no protection is needed, proceed with Nav
    if (!onBeforeNavigate) return

    e.preventDefault()
    const canNavigate = await onBeforeNavigate()

    if (canNavigate) {
      router.push(href)
    } else {
      setPendingHref(href)
      setShowDialog(true)
    }
  }, [href, onBeforeNavigate, router])

  const handleSaveAndLeave = useCallback(async () => {
    if (onSaveAndLeave) {
      const canNavigate = await onSaveAndLeave()
      if (!canNavigate) {
        // If save failed, keep the dialog open
        return
      }
    }
    setShowDialog(false)
    if (pendingHref) {
      router.push(pendingHref)
    }
  }, [onSaveAndLeave, pendingHref, router])

  const handleLeaveWithoutSaving = useCallback(() => {
    setShowDialog(false)
    if (pendingHref) {
      router.push(pendingHref)
    }
  }, [pendingHref, router])

  const handleStayOnPage = useCallback(() => {
    setShowDialog(false)
    setPendingHref(null)
  }, [])

  return (
    <>
      <Link href={href} className={className} onClick={handleClick}>
        {children}
      </Link>

      <NavigationAlertDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onSaveAndLeave={handleSaveAndLeave}
        onLeaveWithoutSaving={handleLeaveWithoutSaving}
        onCancel={handleStayOnPage}
      />
    </>
  )
} 
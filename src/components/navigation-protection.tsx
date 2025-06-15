'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface NavigationProtectionProps {
  when: boolean;
  onBeforeNavigate?: () => Promise<boolean>;
}

export function NavigationProtection({ when, onBeforeNavigate }: NavigationProtectionProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!when) return;

    let isNavigating = false;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (when && !isNavigating) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handlePopState = async (e: PopStateEvent) => {
      if (!when || isNavigating) return;

      // Prevent the default navigation
      e.preventDefault();

      try {
        if (onBeforeNavigate) {
          isNavigating = true;
          const canNavigate = await onBeforeNavigate();
          isNavigating = false;

          if (!canNavigate) {
            // Stay on current page
            router.push(pathname);
          }
        }
      } catch (error) {
        console.error('Navigation error:', error);
        // Stay on current page in case of error
        router.push(pathname);
      }
    };

    // Handle browser back/forward buttons
    window.addEventListener('popstate', handlePopState);
    // Handle page reload/close
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [when, onBeforeNavigate, router, pathname]);

  return null;
} 
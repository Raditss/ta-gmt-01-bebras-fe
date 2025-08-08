'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { StudentNav } from '@/components/layout/Nav/student-nav';
import { UserRole } from '@/types/user-role';

export default function StudentLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Only check authentication after the store has been hydrated from localStorage
    if (isHydrated && (!isAuthenticated || user?.role !== UserRole.STUDENT)) {
      router.replace('/login');
    }
  }, [isAuthenticated, user, router, isHydrated]);

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <StudentNav />
      <main>{children}</main>
    </>
  );
}

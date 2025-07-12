'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { AdminNav } from '@/components/layout/Nav/admin-nav';
import { UserRole } from '@/types/user-role';

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Only check authentication after the store has been hydrated from localStorage
    if (isHydrated && (!isAuthenticated || user?.role !== UserRole.ADMIN)) {
      router.replace('/login');
    }
  }, [isAuthenticated, user, router, isHydrated]);

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminNav />
      <main>{children}</main>
    </>
  );
}

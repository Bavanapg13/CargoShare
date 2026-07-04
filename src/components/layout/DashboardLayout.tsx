'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const DashboardLayout = ({ children, allowedRole }: { children: React.ReactNode, allowedRole?: string }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (allowedRole && user.role !== allowedRole) {
        router.push(`/${user.role}/dashboard`);
      }
    }
  }, [user, isLoading, router, allowedRole]);

  if (isLoading || !user) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/20">
        {children}
      </main>
    </div>
  );
};

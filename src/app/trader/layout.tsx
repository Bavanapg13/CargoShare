'use client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function TraderLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout allowedRole="trader">{children}</DashboardLayout>;
}

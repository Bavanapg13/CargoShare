'use client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function LspLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout allowedRole="lsp">{children}</DashboardLayout>;
}

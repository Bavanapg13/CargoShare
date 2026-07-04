'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { User } from '@/lib/data';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || []);
        setLoading(false);
      });
  }, []);

  const pendingLSPs = users.filter(u => u.role === 'lsp' && u.status === 'pending');
  const traders = users.filter(u => u.role === 'trader');
  const approvedLSPs = users.filter(u => u.role === 'lsp' && u.status === 'approved');

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-primary">{pendingLSPs.length}</span>
            <span className="text-sm font-medium text-muted-foreground mt-2">Pending Approvals</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-green-500">{approvedLSPs.length}</span>
            <span className="text-sm font-medium text-muted-foreground mt-2">Active LSPs</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-blue-500">{traders.length}</span>
            <span className="text-sm font-medium text-muted-foreground mt-2">Registered Traders</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-purple-500">12</span>
            <span className="text-sm font-medium text-muted-foreground mt-2">Active Bookings</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Pending LSPs</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingLSPs.length === 0 ? (
            <p className="text-muted-foreground">No pending applications.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted text-muted-foreground uppercase">
                  <tr>
                    <th className="p-3">Company</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Modes</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pendingLSPs.slice(0, 5).map(lsp => (
                    <tr key={lsp.id} className="hover:bg-muted/50">
                      <td className="p-3 font-medium">{lsp.companyName}</td>
                      <td className="p-3">{lsp.name} ({lsp.email})</td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          {lsp.transportMode?.map(m => (
                            <Badge key={m} variant="info" className="capitalize">{m}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-3"><Badge variant="warning">Pending</Badge></td>
                      <td className="p-3 text-right">
                        <Link href="/admin/approvals" className="text-primary hover:underline font-medium">Review</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

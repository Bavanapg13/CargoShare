'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Booking } from '@/lib/data';
import { useAuth } from '@/lib/store';
import Link from 'next/link';

export default function TraderDashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(`/api/bookings?traderId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          setBookings(data.bookings || []);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) return <div>Loading dashboard...</div>;

  const activeBookings = bookings.filter(b => b.status === 'Requested' || b.status === 'Confirmed' || b.status === 'Paid');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground mt-1">Manage your active shipments and discover new space.</p>
        </div>
        <Link href="/marketplace">
          <Button>Find Space Now</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Active Shipments</div>
            <div className="text-3xl font-bold mt-2">{activeBookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Total Bookings</div>
            <div className="text-3xl font-bold mt-2">{bookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Total Spent</div>
            <div className="text-3xl font-bold mt-2 text-primary">
              ${bookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📦</div>
              <p className="text-muted-foreground mb-4">You have no active bookings yet.</p>
              <Link href="/marketplace">
                <Button variant="outline">Browse Marketplace</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted text-muted-foreground uppercase">
                  <tr>
                    <th className="p-3">ID / Date</th>
                    <th className="p-3">Route</th>
                    <th className="p-3">Cargo Details</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-muted/50">
                      <td className="p-3">
                        <div className="font-medium">#{booking.id.toUpperCase()}</div>
                        <div className="text-xs text-muted-foreground">{booking.date}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{booking.origin}</div>
                        <div className="text-xs text-muted-foreground">to {booking.destination}</div>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {booking.weight} kg, {booking.volume} CBM
                      </td>
                      <td className="p-3 font-medium">${booking.totalPrice.toLocaleString()}</td>
                      <td className="p-3 text-right">
                        <Badge variant="success">{booking.status}</Badge>
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

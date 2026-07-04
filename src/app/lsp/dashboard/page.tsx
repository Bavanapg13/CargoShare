'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ContainerListing, Booking } from '@/lib/data';
import { useAuth } from '@/lib/store';
import Link from 'next/link';

export default function LspDashboardPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<ContainerListing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([
        fetch(`/api/listings?lspId=${user.id}`).then(res => res.json()),
        fetch(`/api/bookings?lspId=${user.id}`).then(res => res.json())
      ]).then(([listingsData, bookingsData]) => {
        setListings(listingsData.listings || []);
        setBookings(bookingsData.bookings || []);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) return <div>Loading dashboard...</div>;

  if (user?.status === 'pending') {
    return (
      <Card className="max-w-2xl mx-auto mt-12 text-center p-8 border-warning/50 bg-warning/10">
        <div className="text-4xl mb-4">⏳</div>
        <CardTitle className="text-2xl text-warning-foreground mb-2">Application Pending</CardTitle>
        <p className="text-muted-foreground">
          Your LSP account is currently under review by our admin team. Once approved, you will be able to create container listings and manage bookings.
        </p>
      </Card>
    );
  }

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">LSP Dashboard</h1>
          <p className="text-muted-foreground mt-1">{user?.companyName} - Manage your capacity and bookings.</p>
        </div>
        <Link href="/lsp/create-listing">
          <Button>Create Listing</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Active Listings</div>
            <div className="text-3xl font-bold mt-2">{listings.length}</div>
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
            <div className="text-sm font-medium text-muted-foreground">Estimated Revenue</div>
            <div className="text-3xl font-bold mt-2 text-primary">
              ${totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Container Listings</CardTitle>
          </CardHeader>
          <CardContent>
            {listings.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">You haven't posted any container space yet.</p>
            ) : (
              <div className="space-y-4">
                {listings.map(listing => (
                  <div key={listing.id} className="border border-border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-base">{listing.origin} → {listing.destination}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {listing.mode.toUpperCase()} | {listing.availableWeight} kg remaining | Departs: {new Date(listing.departureDate).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant={listing.status === 'Available' ? 'success' : listing.status === 'Almost Full' ? 'warning' : 'default'}>
                      {listing.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incoming Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">No bookings received yet.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map(booking => (
                  <div key={booking.id} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold">Booking #{booking.id.toUpperCase()}</div>
                      <div className="font-bold text-primary">${booking.totalPrice.toLocaleString()}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {booking.origin} to {booking.destination}
                    </div>
                    <div className="mt-3 flex justify-between items-center text-sm">
                      <span className="bg-muted px-2 py-1 rounded">{booking.weight} kg / {booking.volume} CBM</span>
                      <Link href={`/chat?user=${booking.traderId}`} className="text-primary hover:underline font-medium">
                        Message Trader
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

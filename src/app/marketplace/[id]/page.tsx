'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ContainerListing } from '@/lib/data';
import Link from 'next/link';
import { useAuth } from '@/lib/store';

export default function ListingDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [listing, setListing] = useState<ContainerListing | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.listing) {
          setListing(data.listing);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-12 text-center">Loading details...</div>;
  if (!listing) return <div className="p-12 text-center">Listing not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 overflow-y-auto">
      <Link href="/marketplace" className="text-sm text-muted-foreground hover:text-primary mb-6 inline-block">
        ← Back to Marketplace
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold tracking-tight">
              {listing.containerType} Space ({listing.containerSize})
            </h1>
            <Badge variant={listing.status === 'Available' ? 'success' : 'warning'} className="text-sm px-3 py-1">
              {listing.status}
            </Badge>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-6 relative">
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground uppercase font-semibold mb-1">Origin</div>
                  <div className="font-medium text-lg">{listing.origin}</div>
                  <div className="text-sm text-muted-foreground mt-2">Departure: <span className="font-medium text-foreground">{new Date(listing.departureDate).toLocaleDateString()}</span></div>
                </div>
                
                <div className="hidden md:flex flex-col justify-center items-center px-4 flex-1">
                  <div className="w-full h-px bg-border relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-2xl">
                      {listing.mode === 'ship' ? '🚢' : listing.mode === 'air' ? '✈️' : listing.mode === 'road' ? '🚛' : '🚂'}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-4 text-center">
                    {listing.estimatedTransitTime} Transit
                  </div>
                </div>

                <div className="flex-1 text-left md:text-right">
                  <div className="text-sm text-muted-foreground uppercase font-semibold mb-1">Destination</div>
                  <div className="font-medium text-lg">{listing.destination}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Space & Capacity Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Available Weight</div>
                  <div className="text-xl font-bold text-primary">{listing.availableWeight} <span className="text-sm font-normal">kg</span></div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Available Volume</div>
                  <div className="text-xl font-bold text-primary">{listing.availableVolume} <span className="text-sm font-normal">CBM</span></div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Container Type</div>
                  <div className="text-base font-medium">{listing.containerType}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Transport Mode</div>
                  <div className="text-base font-medium capitalize">{listing.mode}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-primary shadow-sm">
            <CardHeader className="bg-primary/5 pb-4 border-b border-border/50">
              <CardTitle className="text-xl flex items-center justify-between">
                Booking Summary
                <span className="text-2xl font-bold text-primary">${listing.pricePerKg}<span className="text-sm font-normal text-muted-foreground">/kg</span></span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Price</span>
                  <span className="font-medium">${listing.pricePerKg} per kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="font-medium">2.5%</span>
                </div>
                <hr className="border-border" />
                <p className="text-xs text-muted-foreground text-center">
                  Final price calculated during booking based on your exact weight and volume.
                </p>
              </div>

              {user?.role === 'trader' ? (
                <Link href={`/booking/${listing.id}`}>
                  <Button size="lg" fullWidth>Book Space Now</Button>
                </Link>
              ) : !user ? (
                <Link href="/login">
                  <Button size="lg" fullWidth>Log in as Trader to Book</Button>
                </Link>
              ) : (
                <Button size="lg" fullWidth disabled>Traders Only</Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center text-xl">
                  🏢
                </div>
                <div>
                  <div className="font-bold flex items-center">
                    {listing.lspName}
                    {listing.lspVerified && <span className="text-blue-500 ml-1" title="Verified">✓</span>}
                  </div>
                  <div className="text-sm text-muted-foreground">Verified Logistics Provider</div>
                </div>
              </div>
              {user?.role === 'trader' && (
                <Link href={`/chat?user=${listing.lspId}`}>
                  <Button variant="outline" fullWidth>Message Provider</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

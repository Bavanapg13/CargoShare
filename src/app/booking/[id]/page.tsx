'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ContainerListing } from '@/lib/data';
import { useAuth } from '@/lib/store';
import Link from 'next/link';

export default function BookingCheckoutPage() {
  const params = useParams();
  const id = params.id as string;
  const [listing, setListing] = useState<ContainerListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // Booking details
  const [weight, setWeight] = useState(100);
  const [volume, setVolume] = useState(1);
  const [goodsCategory, setGoodsCategory] = useState('');
  const [specialHandling, setSpecialHandling] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'trader') {
      router.push('/login');
      return;
    }

    fetch(`/api/listings/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.listing) {
          setListing(data.listing);
        }
        setLoading(false);
      });
  }, [id, user, router]);

  if (loading) return <div className="p-12 text-center">Loading booking details...</div>;
  if (!listing) return <div className="p-12 text-center">Listing not found</div>;

  const basePrice = weight * listing.pricePerKg;
  const serviceFee = basePrice * 0.025;
  const totalPrice = basePrice + serviceFee;

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (weight > listing.availableWeight) {
      alert('Weight exceeds available capacity!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          traderId: user?.id,
          weight,
          volume,
          totalPrice
        }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        alert('Booking failed');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-muted/20 overflow-y-auto">
        <Card className="w-full max-w-md text-center p-8">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
          <CardTitle className="text-2xl mb-2">Booking Confirmed!</CardTitle>
          <p className="text-muted-foreground mb-6">
            Your space on {listing.lspName}'s container has been successfully booked. An invoice has been generated.
          </p>
          <div className="bg-muted p-4 rounded-lg mb-6 text-left space-y-2 text-sm">
            <div className="flex justify-between"><span>Origin:</span> <span className="font-medium">{listing.origin}</span></div>
            <div className="flex justify-between"><span>Destination:</span> <span className="font-medium">{listing.destination}</span></div>
            <div className="flex justify-between"><span>Amount Paid:</span> <span className="font-bold">${totalPrice.toFixed(2)}</span></div>
          </div>
          <div className="flex space-x-4">
            <Link href="/trader/dashboard" className="flex-1">
              <Button fullWidth variant="outline">Go to Dashboard</Button>
            </Link>
            <Button className="flex-1" onClick={() => window.print()}>Download Invoice</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 overflow-y-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Complete Booking</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Shipment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="booking-form" onSubmit={handleBook} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Weight (kg)</label>
                  <input
                    type="number"
                    min="1"
                    max={listing.availableWeight}
                    required
                    value={weight}
                    onChange={e => setWeight(Number(e.target.value))}
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Max: {listing.availableWeight} kg</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Volume (CBM)</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    max={listing.availableVolume}
                    required
                    value={volume}
                    onChange={e => setVolume(Number(e.target.value))}
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Max: {listing.availableVolume} CBM</p>
                </div>
              </div>
              
              <Input 
                label="Goods Category (e.g. Electronics, Textiles)" 
                required 
                value={goodsCategory}
                onChange={e => setGoodsCategory(e.target.value)}
              />
              
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Special Handling Notes (Optional)</label>
                <textarea
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
                  value={specialHandling}
                  onChange={e => setSpecialHandling(e.target.value)}
                />
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rate</span>
                  <span>${listing.pricePerKg} / kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Charge ({weight} kg)</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee (2.5%)</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <hr className="border-border/50" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-primary">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="bg-background rounded border border-border p-3 mb-6 flex items-center space-x-3">
                <div className="w-8 h-6 bg-slate-200 rounded"></div>
                <div className="text-sm font-medium">Demo Payment Gateway</div>
              </div>

              <Button 
                type="submit" 
                form="booking-form" 
                size="lg" 
                fullWidth 
                disabled={isSubmitting || weight > listing.availableWeight}
              >
                {isSubmitting ? 'Processing Payment...' : `Pay $${totalPrice.toFixed(2)} & Book`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

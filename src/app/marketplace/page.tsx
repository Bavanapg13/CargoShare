'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ContainerListing } from '@/lib/data';
import Link from 'next/link';
import { useAuth } from '@/lib/store';

export default function MarketplacePage() {
  const [listings, setListings] = useState<ContainerListing[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [modeFilter, setModeFilter] = useState('');

  useEffect(() => {
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        setListings(data.listings || []);
        setLoading(false);
      });
  }, []);

  const filteredListings = listings.filter(l => {
    const matchesSearch = l.origin.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = modeFilter ? l.mode === modeFilter : true;
    return matchesSearch && matchesMode;
  });

  if (loading) return <div className="p-12 text-center">Loading marketplace...</div>;

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-muted/10">
      {/* Filters Sidebar */}
      <div className="w-full md:w-72 bg-card border-r border-border p-6 overflow-y-auto hidden md:block shrink-0">
        <h2 className="text-lg font-bold mb-6">Filters</h2>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Location</label>
            <Input 
              placeholder="Origin or Destination" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Transport Mode</label>
            <select 
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
            >
              <option value="">All Modes</option>
              <option value="ship">Ocean Freight (Ship)</option>
              <option value="air">Air Freight</option>
              <option value="road">Road Freight</option>
              <option value="rail">Rail Freight</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Departure Date</label>
            <Input type="date" />
          </div>

          <Button variant="outline" fullWidth onClick={() => { setSearchTerm(''); setModeFilter(''); }}>
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Available Container Space</h1>
            <p className="text-muted-foreground mt-1">Found {filteredListings.length} results</p>
          </div>
          {/* Mobile filter toggle would go here */}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredListings.map(listing => (
            <Card key={listing.id} className="hover:shadow-md transition-shadow hover:border-primary/50 group overflow-hidden">
              <div className="flex flex-col sm:flex-row h-full">
                <div className="sm:w-1/3 bg-muted/50 p-6 flex flex-col justify-center items-center border-b sm:border-b-0 sm:border-r border-border text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl mb-3">
                    {listing.mode === 'ship' ? '🚢' : listing.mode === 'air' ? '✈️' : listing.mode === 'road' ? '🚛' : '🚂'}
                  </div>
                  <div className="font-bold text-lg capitalize">{listing.mode}</div>
                  <div className="text-sm text-muted-foreground mt-1">{listing.containerType}</div>
                  <Badge variant={listing.status === 'Available' ? 'success' : 'warning'} className="mt-4">
                    {listing.status}
                  </Badge>
                </div>
                
                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">Route</div>
                      <div className="font-medium text-lg leading-tight">{listing.origin}</div>
                      <div className="text-muted-foreground text-sm my-1">↓</div>
                      <div className="font-medium text-lg leading-tight">{listing.destination}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">${listing.pricePerKg}</div>
                      <div className="text-xs text-muted-foreground">per kg</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mt-2 mb-6">
                    <div>
                      <span className="text-muted-foreground block">Departure</span>
                      <span className="font-medium">{new Date(listing.departureDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Transit Time</span>
                      <span className="font-medium">{listing.estimatedTransitTime}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Available Weight</span>
                      <span className="font-medium">{listing.availableWeight} kg</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Provider</span>
                      <span className="font-medium flex items-center">
                        {listing.lspName} 
                        {listing.lspVerified && <span className="text-blue-500 ml-1" title="Verified">✓</span>}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 flex space-x-3 border-t border-border">
                    <Link href={`/marketplace/${listing.id}`} className="flex-1">
                      <Button fullWidth className="group-hover:bg-primary/90">View Details</Button>
                    </Link>
                    {user?.role === 'trader' && (
                      <Link href={`/chat?user=${listing.lspId}`}>
                        <Button variant="outline" className="px-4 text-xl">💬</Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {filteredListings.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-card border border-border rounded-xl">
              <span className="text-4xl mb-4 block">🔍</span>
              No container space matches your current filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

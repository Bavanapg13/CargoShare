'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/store';

export default function CreateListingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    mode: 'road',
    origin: '',
    destination: '',
    departureDate: '',
    containerType: 'Standard Dry',
    containerSize: '20ft',
    availableVolume: 0,
    availableWeight: 0,
    pricePerKg: 0,
    estimatedTransitTime: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          lspId: user?.id,
          lspName: user?.companyName,
        }),
      });

      if (res.ok) {
        router.push('/lsp/dashboard');
      } else {
        alert('Failed to create listing');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user?.status !== 'approved') {
    return <div className="p-12 text-center text-red-500">You must be an approved LSP to create listings.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Create Container Listing</h1>
      <p className="text-muted-foreground">Publish available space in your containers to the marketplace.</p>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Transport Mode</label>
                <select 
                  name="mode" 
                  value={formData.mode}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="road">Road Freight</option>
                  <option value="rail">Rail Freight</option>
                  <option value="ship">Ocean Freight (Ship)</option>
                  <option value="air">Air Freight</option>
                </select>
              </div>

              <Input label="Origin Location" name="origin" value={formData.origin} onChange={handleChange} required placeholder="e.g. Mumbai Port" />
              <Input label="Destination Location" name="destination" value={formData.destination} onChange={handleChange} required placeholder="e.g. London LHR" />
              
              <Input label="Departure Date" type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} required />
              <Input label="Estimated Transit Time" name="estimatedTransitTime" value={formData.estimatedTransitTime} onChange={handleChange} required placeholder="e.g. 14 Days" />

              <Input label="Container Type" name="containerType" value={formData.containerType} onChange={handleChange} required placeholder="e.g. Refrigerated" />
              <Input label="Container Size" name="containerSize" value={formData.containerSize} onChange={handleChange} required placeholder="e.g. 40ft High Cube" />

              <Input label="Available Weight (kg)" type="number" min="1" name="availableWeight" value={formData.availableWeight || ''} onChange={handleChange} required />
              <Input label="Available Volume (CBM)" type="number" min="0.1" step="0.1" name="availableVolume" value={formData.availableVolume || ''} onChange={handleChange} required />
              
              <div className="col-span-1 md:col-span-2">
                <Input label="Price Per Kg ($)" type="number" min="0.01" step="0.01" name="pricePerKg" value={formData.pricePerKg || ''} onChange={handleChange} required />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Publishing...' : 'Publish Listing'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

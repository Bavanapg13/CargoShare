'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function LspApplyPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    phone: '',
    transportMode: ['road']
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === 'transportMode') {
      const select = e.target as HTMLSelectElement;
      const values = Array.from(select.selectedOptions, option => option.value);
      setFormData({ ...formData, transportMode: values });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'lsp' }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Application failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-muted/20">
        <Card className="w-full max-w-md text-center p-8">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
          <CardTitle className="text-2xl mb-2">Application Submitted</CardTitle>
          <p className="text-muted-foreground mb-6">
            Your registration is currently pending inspection. An admin will review your details before you can access the LSP dashboard and publish listings.
          </p>
          <Link href="/login">
            <Button fullWidth>Return to Login</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-muted/20 py-12 overflow-y-auto">
      <Card className="w-full max-w-xl">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">Apply as Logistics Service Provider</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">Join our network and monetize your empty container space</p>
        </CardHeader>
        <CardContent>
          {error && <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 rounded-md">{error}</div>}
          
          <form onSubmit={handleApply} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Contact Person" name="name" value={formData.name} onChange={handleChange} required />
              <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required />
              <Input label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} required />
              <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
              
              <div className="w-full md:col-span-2">
                <label className="block text-sm font-medium mb-1.5 text-foreground">Transport Modes Supported</label>
                <select 
                  name="transportMode" 
                  multiple 
                  className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onChange={handleChange}
                  required
                >
                  <option value="road">Road Freight</option>
                  <option value="rail">Rail Freight</option>
                  <option value="ship">Ocean/Sea Freight</option>
                  <option value="air">Air Freight</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>

              <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required className="md:col-span-2" />
            </div>
            
            <Button type="submit" fullWidth className="mt-6" disabled={isLoading}>
              {isLoading ? 'Submitting Application...' : 'Submit Application'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">Log in</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

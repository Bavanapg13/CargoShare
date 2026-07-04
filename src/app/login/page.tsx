'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user);
        router.push(`/${data.user.role}/dashboard`);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">Enter your credentials to access your account</p>
        </CardHeader>
        <CardContent>
          {error && <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 rounded-md">{error}</div>}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              label="Email Address" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <Input 
              label="Password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center space-x-2 text-sm text-muted-foreground">
                <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                <span>Remember me</span>
              </label>
              <Link href="#" className="text-sm text-primary hover:underline">Forgot password?</Link>
            </div>
            
            <Button type="submit" fullWidth className="mt-4" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline font-medium">Register as Trader</Link>
            {' '}or{' '}
            <Link href="/lsp-apply" className="text-primary hover:underline font-medium">Apply as LSP</Link>
          </div>
        </CardContent>
      </Card>
      
      {/* Demo Credentials Helper */}
      <div className="absolute bottom-4 right-4 max-w-xs p-4 bg-card border border-border shadow-lg rounded-lg text-xs hidden md:block">
        <div className="font-bold mb-2">Demo Credentials:</div>
        <div><span className="font-semibold">Admin:</span> admin@cargoshare.com / password</div>
        <div><span className="font-semibold">Trader:</span> john@export.com / password</div>
        <div><span className="font-semibold">Approved LSP:</span> contact@globalfreight.com / password</div>
        <div><span className="font-semibold">Pending LSP:</span> info@speedyroad.com / password</div>
      </div>
    </div>
  );
}

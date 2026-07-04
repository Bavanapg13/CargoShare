'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/store';
import { Button } from '@/components/ui/Button';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            CargoShare
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/marketplace" className="text-sm font-medium hover:text-primary transition-colors">
            Marketplace
          </Link>
          <Link href="/#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
            How it Works
          </Link>
          
          <div className="h-6 w-px bg-border mx-2"></div>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link href={`/${user.role}/dashboard`}>
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <div className="text-sm font-medium px-3 py-1 bg-muted rounded-full">
                {user.name} ({user.role})
              </div>
              <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Register Trader</Button>
              </Link>
              <Link href="/lsp-apply">
                <Button variant="secondary" size="sm">Apply as LSP</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

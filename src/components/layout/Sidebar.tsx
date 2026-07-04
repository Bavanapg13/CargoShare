'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/store';

export const Sidebar = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const links = {
    trader: [
      { name: 'Dashboard', href: '/trader/dashboard' },
      { name: 'Marketplace', href: '/marketplace' },
      { name: 'My Bookings', href: '/trader/bookings' },
      { name: 'Payments', href: '/trader/payments' },
      { name: 'Messages', href: '/chat' },
      { name: 'Profile', href: '/trader/profile' },
    ],
    lsp: [
      { name: 'Dashboard', href: '/lsp/dashboard' },
      { name: 'My Listings', href: '/lsp/listings' },
      { name: 'Create Listing', href: '/lsp/create-listing' },
      { name: 'Incoming Bookings', href: '/lsp/bookings' },
      { name: 'Messages', href: '/chat' },
      { name: 'Profile', href: '/lsp/profile' },
    ],
    admin: [
      { name: 'Dashboard', href: '/admin/dashboard' },
      { name: 'Pending Approvals', href: '/admin/approvals' },
      { name: 'All Users', href: '/admin/users' },
      { name: 'All Bookings', href: '/admin/bookings' },
    ]
  };

  const navLinks = links[user.role as keyof typeof links] || [];

  return (
    <div className="w-64 h-[calc(100vh-4rem)] border-r border-border bg-card overflow-y-auto hidden md:block">
      <div className="p-4">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Menu
        </h2>
        <nav className="space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ContainerListing } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lspId = searchParams.get('lspId');
  
  let listings = db.listings;
  
  if (lspId) {
    listings = listings.filter(l => l.lspId === lspId);
  }
  
  return NextResponse.json({ listings });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const newListing: ContainerListing = {
      id: `l${db.listings.length + 1}`,
      ...data,
      lspVerified: true, // Assuming only verified LSPs can post
      status: 'Available'
    };
    
    db.listings.push(newListing);
    return NextResponse.json({ listing: newListing });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

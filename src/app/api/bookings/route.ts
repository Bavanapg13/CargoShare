import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Booking } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const traderId = searchParams.get('traderId');
  const lspId = searchParams.get('lspId');
  
  let bookings = db.bookings;
  
  if (traderId) {
    bookings = bookings.filter(b => b.traderId === traderId);
  }
  if (lspId) {
    bookings = bookings.filter(b => b.lspId === lspId);
  }
  
  return NextResponse.json({ bookings });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const listing = db.listings.find(l => l.id === data.listingId);
    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

    const newBooking: Booking = {
      id: `b${db.bookings.length + 1}`,
      listingId: data.listingId,
      traderId: data.traderId,
      lspId: listing.lspId,
      status: 'Confirmed', // Automatically confirmed for MVP
      weight: data.weight,
      volume: data.volume,
      totalPrice: data.totalPrice,
      date: new Date().toISOString().split('T')[0],
      origin: listing.origin,
      destination: listing.destination
    };
    
    // Update listing capacity
    listing.availableWeight -= data.weight;
    listing.availableVolume -= data.volume;
    if (listing.availableWeight <= 0 || listing.availableVolume <= 0) {
      listing.status = 'Booked Out';
    } else if (listing.availableWeight < 1000 || listing.availableVolume < 5) {
      listing.status = 'Almost Full';
    }
    
    db.bookings.push(newBooking);
    return NextResponse.json({ booking: newBooking });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const listing = db.listings.find(l => l.id === id);
  
  if (listing) {
    return NextResponse.json({ listing });
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

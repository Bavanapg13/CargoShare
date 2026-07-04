import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const userIndex = db.users.findIndex(u => u.id === id);
    if (userIndex === -1) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    
    // Admin update logic (e.g. approve/reject)
    db.users[userIndex] = {
      ...db.users[userIndex],
      ...data
    };
    
    const { password: _, ...safeUser } = db.users[userIndex];
    return NextResponse.json({ user: safeUser });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

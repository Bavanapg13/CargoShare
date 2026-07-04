import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { User } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Check if user exists
    if (db.users.find(u => u.email === data.email)) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }
    
    const newUser: User = {
      id: `u${db.users.length + 1}`,
      ...data,
      status: data.role === 'lsp' ? 'pending' : 'approved',
    };
    
    db.users.push(newUser);
    
    const { password: _, ...safeUser } = newUser;
    return NextResponse.json({ user: safeUser });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

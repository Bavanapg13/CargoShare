import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    const user = db.users.find(u => u.email === email && u.password === password);
    
    if (user) {
      if (user.role === 'lsp' && user.status === 'pending') {
        return NextResponse.json({ error: 'Your account is pending admin approval.' }, { status: 403 });
      }
      if (user.role === 'lsp' && user.status === 'rejected') {
        return NextResponse.json({ error: 'Your account application was rejected.' }, { status: 403 });
      }
      
      // In a real app, we would sign a JWT here. For MVP, just return user info.
      const { password: _, ...safeUser } = user;
      return NextResponse.json({ user: safeUser });
    }
    
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

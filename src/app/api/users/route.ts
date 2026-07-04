import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');
  const status = searchParams.get('status');
  
  let users = db.users;
  
  if (role) {
    users = users.filter(u => u.role === role);
  }
  if (status) {
    users = users.filter(u => u.status === status);
  }
  
  // Omit passwords
  const safeUsers = users.map(({ password, ...rest }) => rest);
  
  return NextResponse.json({ users: safeUsers });
}

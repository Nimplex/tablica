import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { blacklistToken } from '@/lib/db';
import { verify } from '@/lib/auth/token';

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    const res = NextResponse.json({ message: 'Logged out (not token)' });
    res.cookies.set('token', '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0),
    });
    return res;
  }

  const payload = verify(token);

  if (!payload || !payload.id || !payload.username) {
    const res = NextResponse.json({ message: 'Logged out (invalid user)' });
    res.cookies.set('token', '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0),
    });
    return res;
  }

  blacklistToken(token);

  const res = NextResponse.json({ message: 'Logged out' });
  res.cookies.set('token', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
  });
  return res;
}

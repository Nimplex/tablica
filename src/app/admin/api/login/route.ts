import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { User } from '@/lib/models/User';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const user = User.getByUsername(username);

  if (!user || !(await user.comparePassword(password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = jwt.sign(
    { id: user.id, username: user.name },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '7d',
    },
  );

  const res = NextResponse.json({ message: 'Logged in' });
  res.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'strict',
  });

  return res;
}

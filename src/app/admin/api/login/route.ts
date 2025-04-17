import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/models/User';
import { sign } from '@/lib/auth/token';
import { safeParseJSON } from '@/lib/safeParse';
import loginValidator from './validator';

export interface LoginRequestBody {
  username: string;
  password: string;
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (token)
    return NextResponse.json(
      { errors: ['Already logged in'] },
      { status: 409 },
    );

  const { data: json, error: parseError } =
    await safeParseJSON<LoginRequestBody>(req);

  if (parseError || !json) {
    return NextResponse.json({ errors: [parseError] }, { status: 400 });
  }

  const errors = loginValidator.validate(json as LoginRequestBody);
  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const user = User.getByUsername(json.username);

  if (!user || !(await user.comparePassword(json.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const newToken = sign({ id: user.id as number, username: user.name });

  const res = NextResponse.json({ message: 'Logged in' });
  res.cookies.set('token', newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24,
    sameSite: 'strict',
  });

  return res;
}

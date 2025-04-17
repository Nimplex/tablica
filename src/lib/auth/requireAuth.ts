import { NextRequest } from 'next/server';
import { verify } from './token';

export async function requireAuth(req: NextRequest) {
  const cookie = req.cookies.get('token');

  if (!cookie?.value) return false;

  const payload = verify(cookie.value);

  if (!payload || !payload.id) return false;

  return payload;
}

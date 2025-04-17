import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('Brakuje JWT_SECRET w .env');

export interface AuthTokenPayload {
  id: number;
  username: string;
}

export function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: '1d',
  });
}

export function verifyToken(token?: string): AuthTokenPayload | null {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET as string) as AuthTokenPayload;
  } catch {
    return null;
  }
}

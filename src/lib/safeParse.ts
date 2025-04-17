import { NextRequest } from 'next/server';

export async function safeParseJSON<T>(
  req: NextRequest,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return { data: null, error: 'Invalid content type' };
    }

    const json = await req.json();
    return { data: json, error: null };
  } catch {
    return { data: null, error: 'Invalid JSON body' };
  }
}

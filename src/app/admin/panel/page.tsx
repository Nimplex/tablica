import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verify } from '@/lib/auth/token';
import { User } from '@/lib/models/User';
import { BoardConfig } from '@/lib/models/BoardConfig';
import { ensureInitialized } from '@/lib/bootstrap';
import AdminPanelClient from './AdminPanelClient';

export default async function AdminPanel() {
  await ensureInitialized();

  // Authentication check
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const payload = verify(token);
  if (!payload || !payload.id) return redirect('/admin/login');

  const user = User.getById(payload.id);
  if (!user) return redirect('/admin/login');

  const boardConfig = BoardConfig.get();

  return (
    <AdminPanelClient
      userName={user.name}
      firstSetup={boardConfig.firstSetup}
      currentLayout={JSON.stringify(boardConfig.layout)}
    />
  );
}

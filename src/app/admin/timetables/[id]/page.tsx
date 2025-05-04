import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verify } from '@/lib/auth/token';
import { User } from '@/lib/models/User';
import { Timetable } from '@/lib/models/Timetable';
import EditTimetableClient from './EditTimetableClient';

interface EditTimetableParams {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTimetable({ params }: EditTimetableParams) {
  const { id } = await params;

  if (isNaN(parseInt(id))) return redirect('/timetables');

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const payload = verify(token);
  if (!payload || !payload.id) return redirect('/admin/login');

  const user = User.getById(payload.id);
  if (!user) return redirect('/admin/login');

  const timetable = Timetable.getById(parseInt(id));
  if (!timetable) return redirect('/timetables');

  const data = JSON.parse(JSON.stringify(timetable));

  return <EditTimetableClient {...data} />;
}

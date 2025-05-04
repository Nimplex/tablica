import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verify } from '@/lib/auth/token';
import { User } from '@/lib/models/User';
import { Timetable } from '@/lib/models/Timetable';
import { CalendarPlus, IdCard, Pencil, User as UserIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import Header from '../components/Header';
import BackButton from '../components/BackButton';

export default async function Timetables() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const payload = verify(token);
  if (!payload || !payload.id) return redirect('/admin/login');

  const user = User.getById(payload.id);
  if (!user) return redirect('/admin/login');

  const timetables = Timetable.getAll();

  return (
    <div className="container mx-auto p-6 flex flex-col gap-6">
      <Header title={'Zastępstwa'}>
        <BackButton href="/admin/panel">Powrót do panelu</BackButton>
      </Header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {timetables.map(timetable => (
          <Link href={`/admin/timetables/${timetable.id}`} key={timetable.id}>
            <Card className="h-full hover:border-primary transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 gap-2">
                <CardTitle className="text-xl">{timetable.title}</CardTitle>
                <div
                  style={{ backgroundColor: timetable.color }}
                  className="w-8 h-8 rounded"
                ></div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <ul>
                    <li>
                      <div className="flex items-center gap-2">
                        <IdCard className="w-4 h-4" />
                        Klucz główny: {timetable.id}
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        Edytowano: {timetable.editedBy}
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center gap-2">
                        <Pencil className="w-4 h-4" />
                        Edytowano: {timetable.editedAt.toLocaleString()}
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center gap-2">
                        <CalendarPlus className="w-4 h-4" />
                        Utworzono: {timetable.createdAt.toLocaleString()}
                      </div>
                    </li>
                  </ul>
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

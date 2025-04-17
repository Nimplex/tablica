import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { User } from '@/lib/models/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';

export default async function AdminPanel() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const payload = verifyToken(token);

  if (!payload || !payload.id) {
    return redirect('/admin/login');
  }

  const user = User.getById(payload.id);

  if (!user) {
    return redirect('/admin/login');
  }

  return (
    <div>
      <h1>Panel administratora</h1>
      <p>
        Zalogowany jako: <strong>{user.name}</strong>
      </p>
      <div>
        <div className="card">
          <FontAwesomeIcon icon={faPencil} />
          <h1>Zastępstwa</h1>
        </div>
        <div className="card">
          <FontAwesomeIcon icon={faPencil} />
          <h1>Pola tesktowe</h1>
        </div>
        <div className="card">
          <FontAwesomeIcon icon={faTable} />
          <h1>Układ strony</h1>
        </div>
      </div>
    </div>
  );
}

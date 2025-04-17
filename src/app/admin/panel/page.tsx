import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verify } from '@/lib/auth/token';
import { User } from '@/lib/models/User';
import { BoardConfig } from '@/lib/models/BoardConfig';
import { initializeDatabase } from '@/lib/db';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';

import './panel.css';

export default async function Panel() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const payload = verify(token);

  if (!payload || !payload.id) {
    return redirect('/admin/login');
  }

  const user = User.getById(payload.id);

  if (!user) {
    return redirect('/admin/login');
  }

  let boardConfig: BoardConfig;

  try {
    boardConfig = BoardConfig.get();
  } catch {
    await initializeDatabase();
    boardConfig = BoardConfig.get();
  }

  return (
    <main className="dashboard-wrapper">
      <div className="dashboard">
        <h1>Panel administratora</h1>
        <p>
          Zalogowany jako: <b>{user.name}</b>
        </p>
        {boardConfig.firstSetup && (
          <div>
            <h1>Tablica nie została skonfigurowana</h1>
            <button>Przeprowadź wstępną konfiguracje</button>
          </div>
        )}
        <div className="buttons">
          <div className="card">
            <FontAwesomeIcon icon={faPencil} />
            <h1>Zastępstwa</h1>
          </div>
          <div className="card">
            <FontAwesomeIcon icon={faPencil} />
            <h1>
              Pola
              <br />
              tesktowe
            </h1>
          </div>
          <div className="card">
            <FontAwesomeIcon icon={faTable} />
            <h1>
              Układ
              <br />
              strony
            </h1>
          </div>
          <div className="card">
            <FontAwesomeIcon icon={faCog} />
            <h1>Ustawienia</h1>
          </div>
        </div>
      </div>
    </main>
  );
}

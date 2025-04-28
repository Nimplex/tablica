import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verify } from '@/lib/auth/token';
import { User } from '@/lib/models/User';
import { BoardConfig } from '@/lib/models/BoardConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { ensureInitialized } from '@/lib/bootstrap';
import Container from '@/app/components/Container';
import Card from '@/app/components/Card';
import Column from '@/app/components/Column';

import FirstSetupForm from './FirstSetupForm';

import './panel.css';

export default async function Panel() {
  await ensureInitialized();

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const payload = verify(token);

  if (!payload || !payload.id) return redirect('/admin/login');

  const user = User.getById(payload.id);

  if (!user) return redirect('/admin/login');

  const boardConfig = BoardConfig.get();

  return (
    <Container>
      <Column>
        <h1>Panel administratora</h1>
        <p>
          Zalogowany jako: <b>{user.name}</b>
        </p>
      </Column>
      {boardConfig.firstSetup && (
        <Card>
          <h2>Tablica nie została skonfigurowana</h2>
          <FirstSetupForm currentLayout={JSON.stringify(boardConfig.layout)} />
        </Card>
      )}
      <div className='buttons-container'>
        <Card className="btn-card">
          <FontAwesomeIcon icon={faPencil} />
          <h1>Zastępstwa</h1>
        </Card>
        <Card className="btn-card">
          <FontAwesomeIcon icon={faPencil} />
          <h1>Pola tesktowe</h1>
        </Card>
        <Card className="btn-card">
          <FontAwesomeIcon icon={faTable} />
          <h1>Układ strony</h1>
        </Card>
        <Card className="btn-card">
          <FontAwesomeIcon icon={faCog} />
          <h1>Ustawienia</h1>
        </Card>
      </div>
    </Container>
  );
}

'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const res = await fetch('/admin/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push('/admin/panel');
    } else {
      alert('Błędne dane logowania');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="username"
        placeholder="Nazwa użytkownika"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Hasło"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Zaloguj się</button>
    </form>
  );
}

import { JSX } from 'react';

import './Card.css';

export default function Card({ children }: { children: JSX.Element }) {
  return <div className="card">{children}</div>;
}

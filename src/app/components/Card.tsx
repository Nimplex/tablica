import { HTMLAttributes } from 'react';

import './Card.css';
import clsx from 'clsx';

type Props = HTMLAttributes<HTMLDivElement>;

export default function Card({ className, ...props }: Props) {
  return <div className={clsx('card', className)} {...props} />;
}

import { HTMLAttributes } from 'react';

import './Main.css';
import clsx from 'clsx';

type Props = HTMLAttributes<HTMLDivElement>;

export default function Main({ className, ...props }: Props) {
  return <div className={clsx('main', className)} {...props} />;
}

import { HTMLAttributes } from 'react';

import './Column.css';
import clsx from 'clsx';

type Props = HTMLAttributes<HTMLDivElement>;

export default function Column({ className, ...props }: Props) {
  return <div className={clsx('column', className)} {...props} />;
}

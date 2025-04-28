import { HTMLAttributes } from 'react';

import './Row.css';
import clsx from 'clsx';

type Props = HTMLAttributes<HTMLDivElement>;

export default function Row({ className, ...props }: Props) {
  return <div className={clsx('row', className)} {...props} />;
}

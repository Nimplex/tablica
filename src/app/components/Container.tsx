import { HTMLAttributes } from 'react';

import './Container.css';
import clsx from 'clsx';

type Props = HTMLAttributes<HTMLDivElement>;

export default function Container({ className, ...props }: Props) {
  return <div className={clsx('container', className)} {...props} />;
}

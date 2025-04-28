import { HTMLAttributes } from 'react';
import Column from './Column';

import './Form.css';
import clsx from 'clsx';

type Props = HTMLAttributes<HTMLDivElement>;

export default function Form({ className, ...props }: Props) {
  return (
    <form>
      <Column className={clsx('form', className)} {...props} />
    </form>
  );
}

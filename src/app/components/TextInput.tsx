import { InputHTMLAttributes } from 'react';

import './TextInput.css';
import clsx from 'clsx';

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function TextInput({ type, className, ...props }: Props) {
  return (
    <input
      type={type}
      className={clsx('text-input', className || 'input-main')}
      {...props}
    />
  );
}

import { ButtonHTMLAttributes } from 'react';

import './Button.css';
import clsx from 'clsx';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className, ...props }: Props) {
  return <button className={clsx('btn', className || 'btn-main')} {...props} />;
}

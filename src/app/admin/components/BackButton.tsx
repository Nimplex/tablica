'use client';

import { useRouter } from 'next/navigation';
import { JSX } from 'react';
import { Button, buttonVariants } from './ui/button';
import { twMerge } from 'tailwind-merge';
import { VariantProps } from 'class-variance-authority';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  href?: string;
  children?: JSX.Element | string;
}

export default function BackButton({
  children,
  href,
  className,
  variant,
}: BackButtonProps &
  React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants>) {
  const router = useRouter();

  function onClick() {
    if (href) return router.push(href);

    router.back();
  }

  return (
    <Button
      onClick={onClick}
      variant={variant || 'secondary'}
      className={twMerge('w-min cursor-pointer', className)}
    >
      <ArrowLeft /> {children}
    </Button>
  );
}

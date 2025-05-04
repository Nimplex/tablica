'use client';

import { Bell } from 'lucide-react';
import { Button } from './ui/button';
import { JSX } from 'react';

interface HeaderProps {
  title: string;
  children?: JSX.Element;
}

export default function Header({ title, children }: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{title}</h1>
        {children}
      </div>
      <Button variant="outline" size="icon">
        <Bell />
      </Button>
    </div>
  );
}

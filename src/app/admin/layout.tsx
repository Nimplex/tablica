import { ThemeProvider } from './components/ThemeProvider';
import { Inter } from 'next/font/google';

import './admin.css';
import { Toaster } from './components/ui/sonner';

const inter = Inter({ subsets: ['latin-ext'] });

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute={'class'}
      defaultTheme={'system'}
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster toastOptions={{ className: inter.className }} />
    </ThemeProvider>
  );
}

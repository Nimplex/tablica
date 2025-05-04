import { ThemeProvider } from './components/ThemeProvider';

import './admin.css';
import { Toaster } from './components/ui/sonner';
import { inter } from '../layout';

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

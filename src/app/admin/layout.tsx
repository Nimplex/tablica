import './admin.css';
import { ThemeProvider } from './components/themeProvider';

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
    </ThemeProvider>
  );
}

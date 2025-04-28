import Main from '../components/Main';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Main>{children}</Main>;
}

'use client';

import { Bell, FileText, Layers, Settings, BadgeInfo } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import FirstSetupDialog from './FirstSetupDialog';
import Link from 'next/link';
import Header from '../components/Header';

interface AdminPanelClientProps {
  userName: string;
  firstSetup: boolean;
  currentLayout: string;
}

export default function AdminPanelClient({
  userName,
  firstSetup,
  currentLayout,
}: AdminPanelClientProps) {
  return (
    <div className="container mx-auto p-6 flex flex-col gap-6">
      <Header title={'Panel administratora'}>
        <p className="text-muted-foreground">
          Zalogowany jako: <span className="font-medium">{userName}</span>
        </p>
      </Header>

      {firstSetup && (
        <Alert className="bg-blue-50 border-blue-200 text-blue-700 flex">
          <div className="flex gap-4 justify-between items-center w-full">
            <div className="flex gap-4 items-center">
              <BadgeInfo className="hidden md:block" />
              <div>
                <AlertTitle className="text-blue-800">
                  Tablica nie została skonfigurowana
                </AlertTitle>
                <AlertDescription className="text-blue-600">
                  Aby korzystać z wszystkich funkcji systemu, uzupełnij
                  podstawową konfigurację tablicy.
                </AlertDescription>
              </div>
            </div>
            <FirstSetupDialog currentLayout={currentLayout} />
          </div>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="timetables">
          <Card className="h-full hover:border-primary transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl">Zastępstwa</CardTitle>
              <Bell className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Zarządzaj zastępstwami dla klas i nauczycieli
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="text_fields">
          <Card className="h-full hover:border-primary transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl">Pola tekstowe</CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Edytuj treści wyświetlane na tablicy
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="layout_editor">
          <Card className="h-full hover:border-primary transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl">Układ strony</CardTitle>
              <Layers className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Dostosuj układ elementów na ekranie tablicy
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="settings">
          <Card className="h-full hover:border-primary transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl">Ustawienia</CardTitle>
              <Settings className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Konfiguruj parametry systemu i konta użytkowników
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

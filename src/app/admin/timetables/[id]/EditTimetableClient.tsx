'use client';

import { useState, useEffect } from 'react';
import { Color } from '@/lib/interpolateColor';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  PlusCircle,
  Save,
  Trash2,
  Calendar,
  User,
  EditIcon,
} from 'lucide-react';
import BackButton from '../../components/BackButton';
import Header from '../../components/Header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';

interface TimetableEntry {
  internalId?: number;
  id: number | null;
  timetableId: number;
  date: Date;
  absentTeacher: string;
  changes: string[];
}

interface Timetable {
  id: number | null;
  title: string;
  color: Color;
  editedBy: string;
  editedAt: Date;
  createdAt: Date;
  entries: TimetableEntry[];
}

interface EditTimetableClientProps {
  id: number | null;
  title: string;
  color: Color;
  entries: TimetableEntry[];
}

const formSchema = z.object({
  title: z.string().nonempty('Tytuł nie może być puste'),
  color: z
    .string()
    .nonempty('Kolor nie może być pusty')
    .regex(
      /^#([0-9A-F]{3}){1,2}$/i,
      'Kolor musi spełniać następujący format: #RGB lub #RRGGBB',
    ),
});

const entryFormSchema = z.object({
  date: z.string().date('Nieprawidłowy format daty'),
  absentTeacher: z.string().nonempty('Nauczyciel nie może być pusty'),
  changes: z.string(),
});

export default function EditTimetableClient({
  id,
  title,
  color,
  entries,
}: EditTimetableClientProps) {
  const [submitting, setSubmitting] = useState(false);
  const [timetable, setTimetable] = useState<Timetable>({
    id,
    title,
    color: color.substring(0, color.length) as Color,
    editedBy: 'system',
    editedAt: new Date(),
    createdAt: new Date(),
    entries: entries.map(entry => {
      entry.date = new Date(entry.date);
      entry.internalId = entry.id as number;
      return entry;
    }),
  });
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [newEntryOpen, setNewEntryOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<TimetableEntry | null>(null);
  const [previewData, setPreviewData] = useState<Timetable>(timetable);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: timetable.title,
      color: timetable.color,
    },
  });

  const entryForm = useForm<z.infer<typeof entryFormSchema>>({
    resolver: zodResolver(entryFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      absentTeacher: '',
      changes: '',
    },
  });

  const watchedTitle = form.watch('title');
  const watchedColor = form.watch('color');

  useEffect(() => {
    setPreviewData(prev => ({
      ...prev,
      title: watchedTitle,
      color: watchedColor as Color,
    }));
  }, [watchedTitle, watchedColor]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        event.preventDefault();
        event.returnValue = true;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [unsavedChanges]);

  useEffect(() => {
    if (!newEntryOpen) {
      setEditMode(false);
      setCurrentEntry(null);
      entryForm.reset({
        date: new Date().toISOString().split('T')[0],
        absentTeacher: '',
        changes: '',
      });
    }

    return () => {};
  }, [newEntryOpen, entryForm]);

  useEffect(() => {
    setUnsavedChanges(true);
    setPreviewData(timetable);
  }, [timetable]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);

    setTimetable({
      ...timetable,
      title: values.title,
      color: values.color as Color,
      editedAt: new Date(),
    });

    try {
      const response = await fetch(`/admin/api/timetables/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: values.title,
          color: values.color,
          entries: timetable.entries,
        }),
      });

      if (response.ok) {
        toast.success('Zapisano zmiany', {
          description:
            'Tablica został zaktualizowana pomyślnie, wyświetlenie nowych danych na ekranie może zająć kilka minut',
        });

        setUnsavedChanges(false);
        return setSubmitting(false);
      }

      toast.error('Błąd', {
        description: 'Nie udało się zapisać zmian.',
      });
      setSubmitting(false);
    } catch (error) {
      toast.error('Błąd', {
        description: 'Nie udało się zapisać zmian. Więcej szczegółów w konsoli',
      });
      console.error(error);
      setSubmitting(false);
    }
  }

  const handleAddEntry = (values: z.infer<typeof entryFormSchema>) => {
    const newEntry: TimetableEntry = {
      internalId: Math.floor(Math.random() * 1000),
      id: null,
      timetableId: timetable.id || 0,
      date: new Date(values.date),
      absentTeacher: values.absentTeacher,
      changes: values.changes
        .split('\n')
        .map(change => change.trim())
        .filter(change => change !== ''),
    };

    setTimetable({
      ...timetable,
      entries: [...timetable.entries, newEntry],
    });

    setNewEntryOpen(false);

    toast.success('Dodano wpis');
  };

  const startEditEntry = (entry: TimetableEntry) => {
    setCurrentEntry(entry);
    entryForm.reset({
      date: entry.date.toISOString().split('T')[0],
      absentTeacher: entry.absentTeacher,
      changes: entry.changes.join('\n'),
    });
    setEditMode(true);
    setNewEntryOpen(true);
  };

  const handleEditEntry = (values: z.infer<typeof entryFormSchema>) => {
    if (!currentEntry) return;

    const updatedEntries = timetable.entries.map(entry => {
      if (entry.internalId === currentEntry.internalId) {
        return {
          ...entry,
          date: new Date(values.date),
          absentTeacher: values.absentTeacher,
          changes: values.changes
            .split('\n')
            .map(change => change.trim())
            .filter(change => change !== ''),
        };
      }
      return entry;
    });

    setTimetable({
      ...timetable,
      entries: updatedEntries,
    });

    setNewEntryOpen(false);

    toast.success('Zaktualizowano wpis');
  };

  const handleDeleteEntry = (entryId: number | undefined) => {
    if (entryId === undefined) return;

    setTimetable({
      ...timetable,
      entries: timetable.entries.filter(entry => entry.internalId !== entryId),
    });

    toast.success('Usunięto wpis');
  };

  const watchedDate = entryForm.watch('date');
  const watchedTeacher = entryForm.watch('absentTeacher');
  const watchedChanges = entryForm.watch('changes');

  const previewEntry = {
    date: watchedDate ? new Date(watchedDate) : new Date(),
    absentTeacher: watchedTeacher || '(wpisz nazwisko)',
    changes: watchedChanges
      ? watchedChanges
          .split('\n')
          .map(change => change.trim())
          .filter(change => change !== '')
      : [],
  };

  return (
    <div className="container mx-auto p-6 flex flex-col gap-6">
      <Header title={`Edycja ${title}`}>
        <BackButton href="/admin/timetables">Powrót do listy</BackButton>
      </Header>

      <div className="grid grid-cols1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Szczegóły</CardTitle>
            <CardDescription>Edytuj podstawowe informacje</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="flex flex-col gap-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tytuł</FormLabel>
                      <FormControl>
                        <Input placeholder="Wprowadź tytuł" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kolor</FormLabel>
                      <FormControl>
                        <div className="flex gap-2 items-center">
                          <Input
                            type="color"
                            {...field}
                            className={'w-12 p-1'}
                          />
                          <Input
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="#RRGGBB"
                            className="flex-1"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="w-full sm:w-auto"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Zapisz zmiany
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground text-justify">
            Po wprowadzeniu jakichkolwiek zmian w danych na stronie, należy je
            zatwierdzić, klikając przycisk znajdujący się powyżej. W przeciwnym
            razie mogą zostać utracone przy przeładowaniu strony lub przejściu
            do innej zakładki.
          </CardFooter>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <CardTitle>Wpisy</CardTitle>
              <CardDescription>Lista wpisów dla tej listy</CardDescription>
            </div>
            <Dialog open={newEntryOpen} onOpenChange={setNewEntryOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4" /> Dodaj wpis
                </Button>
              </DialogTrigger>
              <DialogContent className="gap-6">
                <DialogHeader>
                  <DialogTitle>
                    {editMode ? 'Edytuj wpis' : 'Dodaj nowy wpis'}
                  </DialogTitle>
                  <DialogDescription>
                    {editMode
                      ? 'Zaktualizuj informacje o wpisie'
                      : 'Wprowadź informacje o nowym wpisie'}
                  </DialogDescription>
                </DialogHeader>
                <Form {...entryForm}>
                  <form
                    className="flex flex-col gap-6"
                    onSubmit={entryForm.handleSubmit(
                      editMode ? handleEditEntry : handleAddEntry,
                    )}
                  >
                    <FormField
                      control={entryForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={entryForm.control}
                      name="absentTeacher"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nieobecny nauczyciel</FormLabel>
                          <FormControl>
                            <Input placeholder="Imię i nazwisko" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={entryForm.control}
                      name="changes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zmiany (każda w nowej linii)</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={5}
                              placeholder="Np. Lekcja 3 - zastępstwo: Anna Nowak"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="border rounded-md p-4 bg-muted/30">
                      <h3 className="font-medium mb-2">Podgląd wpisu:</h3>
                      <div className="text-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {previewEntry.date.toLocaleDateString(
                              navigator.language,
                              {
                                day: 'numeric',
                                month: 'numeric',
                                year: 'numeric',
                              },
                            )}{' '}
                            (
                            {previewEntry.date.toLocaleDateString(
                              navigator.language,
                              {
                                weekday: 'short',
                              },
                            )}
                            )
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-red-500" />
                          <span className="font-semibold text-red-500">
                            {previewEntry.absentTeacher}
                          </span>
                        </div>
                        {previewEntry.changes.length > 0 ? (
                          <ol className="list-decimal list-inside space-y-1 pl-2">
                            {previewEntry.changes.map((change, idx) => (
                              <li key={idx}>{change}</li>
                            ))}
                          </ol>
                        ) : (
                          <p className="text-muted-foreground italic">
                            Brak zmian. Dodaj zmiany w polu tekstowym powyżej.
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="sm:self-end flex flex-col sm:flex-row gap-4 sm:gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setNewEntryOpen(false)}
                      >
                        Anuluj
                      </Button>
                      <Button type="submit">
                        {editMode ? 'Zapisz wpis' : 'Dodaj wpis'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
            {timetable.entries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Brak wpisów. Dodaj pierwszy wpis przy użyciu przycisku powyżej.
              </div>
            ) : (
              timetable.entries.map(entry => (
                <Card
                  key={entry.internalId}
                  className="hover:border-primary transition-colors gap-6"
                >
                  <CardHeader className="flex flex-row gap-4 flex-wrap items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {entry.date.toLocaleDateString(navigator.language, {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      (
                      {entry.date.toLocaleDateString(navigator.language, {
                        weekday: 'short',
                      })}
                      )
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditEntry(entry)}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteEntry(entry.internalId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-red-500" />
                      <span className="font-semibold text-red-500">
                        {entry.absentTeacher}
                      </span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 pl-2">
                      {entry.changes.map((change, idx) => (
                        <li key={idx} className="text-sm">
                          {change}
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Podgląd</CardTitle>
            <CardDescription>
              Podgląd aktualizowany jest na bieżąco podczas edycji
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border rounded-md overflow-auto"
              style={{ height: '400px' }}
            >
              <div
                className="timetable"
                style={{
                  background: `linear-gradient(0deg, ${previewData.color} 0%, #0f0f0fee 90%)`,
                }}
              >
                <h1 className="p-4 text-2xl font-bold text-white">
                  {previewData.title}
                </h1>
                <span className="divider block border-t border-white/10 mx-4"></span>
                <div className="list-decimal p-4 overflow-y-auto">
                  {previewData.entries.map((entry, i) => (
                    <div key={`entry-${i}`} className="mb-4">
                      {i !== 0 && (
                        <span className="divider block border-t border-white/10 mb-4"></span>
                      )}
                      <div className="entry text-white">
                        <p>
                          <u>
                            {entry.date.toLocaleDateString('pl-PL', {
                              day: 'numeric',
                              month: 'numeric',
                              year: 'numeric',
                            })}{' '}
                            (
                            {entry.date.toLocaleDateString('pl-PL', {
                              weekday: 'short',
                            })}
                            )
                          </u>{' '}
                          - nb:{' '}
                          <span style={{ color: '#fc6f6a', fontWeight: '600' }}>
                            {entry.absentTeacher}
                          </span>
                          :
                        </p>
                        <ol className="list-decimal">
                          {entry.changes.map((change, j) => (
                            <li key={`change-${i}-${j}`} className="ml-5 mt-2">
                              <p className="ml-2">{change}</p>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { AlertTriangleIcon } from 'lucide-react';

const formSchema = z.object({
  weather_api_key: z.string().nonempty({ message: 'Klucz API jest wymagany' }),
  weather_city: z.string().nonempty({ message: 'Miasto jest wymagane' }),
  show_weekday_in_clock: z.boolean(),
  layout_json: z.string().nonempty(),
});

interface FirstSetupDialogProps {
  currentLayout: string;
}

export default function FirstSetupDialog({
  currentLayout,
}: FirstSetupDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[] | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weather_city: '',
      weather_api_key: '',
      layout_json: currentLayout,
      show_weekday_in_clock: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    setErrors(null);

    try {
      const response = await fetch('/admin/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) return window.location.reload();

      const json = await response.json();
      setErrors(
        json.errors || ['Wystąpił błąd podczas zapisywania konfiguracji'],
      );
      setSubmitting(false);
    } catch {
      setErrors(['Wystąpił błąd podczas połączenia z serwerem']);
      setSubmitting(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Rozpocznij konfigurację
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-6">
        <DialogHeader>
          <DialogTitle>Wstępna konfiguracja</DialogTitle>
          <DialogDescription>
            Uzupełnij podstawowe ustawienia tablicy informacyjnej
          </DialogDescription>
        </DialogHeader>
        {errors && (
          <Alert variant="destructive">
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertTitle>Błąd</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-4 space-y-1">
                {errors.map((err, i) => (
                  <li key={`error-${i}`}>{err}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form
            className="flex flex-col gap-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="weather_api_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Klucz API:</FormLabel>
                  <FormControl>
                    <Input placeholder="Wprowadź klucz API..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Klucz należy pobrać z strony{' '}
                    <a
                      href="https://openweathermap.org/current"
                      target="_blank"
                      className="text-blue-700 underline hover:text-blue-800"
                      rel="noreferrer"
                    >
                      https://openweathermap.org/
                    </a>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weather_city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Miasto:</FormLabel>
                  <FormControl>
                    <Input placeholder="np. Świnoujście" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="show_weekday_in_clock"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Pokazuj dzień tygodnia w zegarze</FormLabel>
                </FormItem>
              )}
            />
            <input type="hidden" {...form.register('layout_json')} />
            <Button
              className="w-full sm:w-auto"
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
              ) : (
                'Zapisz'
              )}
            </Button>
          </form>
          <DialogFooter className="text-xs text-muted-foreground">
            Upewnij się, że wprowadzone dane są poprawne. Po zapisaniu będzie
            można je zmienić w panelu ustawień.
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Eye, EyeOff, AlertTriangleIcon } from 'lucide-react';

const formSchema = z.object({
  username: z.string().nonempty('Nazwa użytkownika nie może być pusta'),
  password: z.string().nonempty('Hasło nie może być puste'),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    setError(null);

    const res = await fetch('/admin/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (res.ok) return router.push('/admin/panel');

    setSubmitting(false);

    const json = await res.json();
    setError(json.error);
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-6">
      <div className="flex gap-6 w-full max-w-sm flex-col">
        <Card className="flex flex-col gap-6">
          <CardHeader>
            <CardTitle>Panel administracyjny</CardTitle>
            <CardDescription>
              Zaloguj się aby kontynuować do ustawień tablicy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertTriangleIcon className="h-4 w-4" />
                <AlertTitle>Błąd logowania</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Form {...form}>
              <form
                className="flex flex-col gap-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nazwa użytkownika</FormLabel>
                      <FormControl>
                        <Input placeholder="..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hasło</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="..."
                            type={showPassword ? 'text' : 'password'}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground transition"
                          >
                            {showPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                  ) : (
                    'Zaloguj się'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground">
          Dostęp wyłącznie dla uprawnionych użytkowników. Wszystkie próby
          logowania są rejestrowane.
        </div>
      </div>
    </div>
  );
}

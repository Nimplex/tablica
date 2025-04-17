'use client';

import { useState } from 'react';

export default function FirstSetupForm({
  currentLayout,
}: {
  currentLayout: string;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[] | null>(null);
  const [form, setForm] = useState({
    show_weekday_in_clock: false,
    weather_api_key: '',
    weather_city: '',
    layout_json: currentLayout,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit() {
    setErrors(null);
    setSubmitting(true);

    const response = await fetch('/admin/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form }),
    });

    if (!response.ok) {
      const json = await response.json();
      setErrors(json.errors);
    } else {
      return window.location.reload();
    }

    setSubmitting(false);
  }

  if (!open)
    return (
      <button onClick={() => setOpen(true)}>
        Przeprowadź wstępną konfigurację
      </button>
    );

  return (
    <div className="first-setup-form-wrapper">
      <form>
        <div className="top-bar">
          <h1>Wstępna konfiguracja</h1>
          <button
            className="exit-button btn-gray"
            onClick={() => setOpen(false)}
          >
            ✖
          </button>
        </div>
        <div className="column">
          <label htmlFor="weather_api_key">Klucz API:</label>
          <input
            type="text"
            id="weather_api_key"
            name="weather_api_key"
            placeholder="..."
            value={form.weather_api_key}
            onChange={handleChange}
            required
          />
          <p>
            Klucz należy pobrać z strony{' '}
            <a href="https://openweathermap.org/current">
              https://openweathermap.org/
            </a>
          </p>
        </div>
        <div className="column">
          <label htmlFor="weather_city">Miasto:</label>
          <input
            type="text"
            id="weather_city"
            name="weather_city"
            placeholder="np. Świnoujście"
            value={form.weather_city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="column" style={{ alignItems: 'flex-start' }}>
          <label htmlFor="show_weekday_in_clock">
            Dzień tygodnia w zegarze:
          </label>
          <input
            type="checkbox"
            id="show_weekday_in_clock"
            name="show_weekday_in_clock"
            checked={form.show_weekday_in_clock}
            onChange={handleChange}
            required
          />
        </div>
        {errors && (
          <div className="column">
            {errors.map((error, i) => (
              <p style={{ color: '#dc3545' }} key={`error-${i}`}>
                {error}
              </p>
            ))}
          </div>
        )}
        <button
          className={submitting ? 'btn-gray' : 'btn-blue'}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Zapisuję...' : 'Zapisz konfigurację'}
        </button>
      </form>
    </div>
  );
}

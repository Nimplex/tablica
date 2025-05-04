import { BoardConfig } from '@/lib/models/BoardConfig';
import { NextResponse } from 'next/server';

const lang = 'pl';
const units = 'metric';

export async function GET() {
  const boardConfig = BoardConfig.get();

  const { weatherApiKey, weatherCity } = boardConfig;

  if (weatherApiKey == '' || weatherCity == '')
    return NextResponse.json(
      { error: 'Weather config not set' },
      { status: 400 },
    );

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${weatherCity}&appid=${weatherApiKey}&lang=${lang}&units=${units}`,
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: 'Weather fetch failed' },
      { status: 500 },
    );
  }

  const json = await response.json();

  return NextResponse.json({
    temp: Math.round(json.main.temp),
    wind: Math.round(json.wind.speed),
    description: json.weather[0].description,
    main: json.weather[0].main,
  });
}

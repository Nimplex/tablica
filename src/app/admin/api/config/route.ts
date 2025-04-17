import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';
import { BoardConfig } from '@/lib/models/BoardConfig';
import { requireAuth } from '@/lib/auth/requireAuth';
import { safeParseJSON } from '@/lib/safeParse';
import configValidator from './validator';

export interface ConfigRequestBody {
  show_weekday_in_clock: boolean;
  weather_api_key: string;
  weather_city: string;
  layout_json: string;
  first_setup: boolean;
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth(req)))
    return NextResponse.json({ errors: ['Invalid token'] }, { status: 401 });

  const { data: json, error: parseError } =
    await safeParseJSON<ConfigRequestBody>(req);

  if (parseError || !json) {
    return NextResponse.json({ errors: [parseError] }, { status: 400 });
  }

  const errors = configValidator.validate(json as ConfigRequestBody);
  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  let boardConfig: BoardConfig;

  try {
    boardConfig = BoardConfig.get();
  } catch {
    await initializeDatabase();
    boardConfig = BoardConfig.get();
  }

  boardConfig.showWeekdayInClock = json.show_weekday_in_clock;
  boardConfig.weatherApiKey = json.weather_api_key;
  boardConfig.weatherApiKey = json.weather_city;
  boardConfig.layout = JSON.parse(json.layout_json);
  boardConfig.firstSetup = json.first_setup;

  boardConfig.update();

  return NextResponse.json({ success: true }, { status: 200 });
}

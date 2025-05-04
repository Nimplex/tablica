import { NextRequest, NextResponse } from 'next/server';
import { BoardConfig } from '@/lib/models/BoardConfig';
import { requireAuth } from '@/lib/auth/requireAuth';
import { safeParseJSON } from '@/lib/safeParse';
import configValidator from './validator';

export interface ConfigRequestBody {
  show_weekday_in_clock: boolean;
  weather_api_key: string;
  weather_city: string;
  layout_json: string;
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

  const boardConfig = BoardConfig.get();

  boardConfig.showWeekdayInClock = json.show_weekday_in_clock;
  boardConfig.weatherApiKey = json.weather_api_key;
  boardConfig.weatherCity = json.weather_city;
  boardConfig.layout = JSON.parse(json.layout_json);
  boardConfig.firstSetup = false;

  boardConfig.update();

  return NextResponse.json({ success: true }, { status: 200 });
}

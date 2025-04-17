import type { BoardConfigRow, SiteLayout } from '@/types/BoardConfig';
import { getOne } from '../db';

export class BoardConfig {
  constructor(
    public showWeekdayInClock: boolean,
    public weatherApiKey: string,
    public weatherCity: string,
    public layout: SiteLayout,
  ) {}

  static get(): BoardConfig {
    const row = getOne<BoardConfigRow>(
      'SELECT * FROM board_config WHERE id = 1',
    );
    if (!row) throw new Error('BoardConfig not found.');

    return new BoardConfig(
      Boolean(row.show_weekday_in_clock),
      row.weather_api_key,
      row.weather_city,
      JSON.parse(row.layout_json),
    );
  }
}

import type { BoardConfigRow, SiteLayout } from '@/types/BoardConfig';
import { getDatabase, getOne } from '../db';

export class BoardConfig {
  constructor(
    public showWeekdayInClock: boolean,
    public weatherApiKey: string,
    public weatherCity: string,
    public layout: SiteLayout,
    public firstSetup: boolean = true,
  ) {}

  update(): void {
    const stmt = getDatabase().prepare(
      'UPDATE board_config SET show_weekday_in_clock = ?, weather_api_key = ?, weather_city = ?, layout_json = ?, first_setup = ? WHERE id = 1',
    );
    stmt.run(
      this.showWeekdayInClock,
      this.weatherApiKey,
      this.weatherCity,
      this.layout,
      this.firstSetup,
    );
  }

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
      Boolean(row.first_setup),
    );
  }
}

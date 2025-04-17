export type PanelWidget =
  | { type: 'timetable'; id: number }
  | { type: 'text'; id: number }
  | { type: 'weather' }
  | { type: 'clock' };

export interface SiteLayout {
  columns: Array<Array<PanelWidget>>;
}

export interface BoardConfigRow {
  id: number;
  show_weekday_in_clock: boolean;
  weather_api_key: string;
  weather_city: string;
  layout_json: string;
  first_setup: boolean;
}

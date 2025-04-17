import { ValidationSchema } from '@/lib/validation';
import { PanelWidget } from '@/types/BoardConfig';
import { ConfigRequestBody } from './route';

function isValidPanelWidget(widget: unknown): widget is PanelWidget {
  if (typeof widget !== 'object' || widget === null) return false;

  const obj = widget as { type: string; id?: unknown };

  switch (obj.type) {
    case 'timetable':
    case 'text':
      return typeof obj.id === 'number';
    case 'weather':
    case 'clock':
      return true;
    default:
      return false;
  }
}

function isValidLayoutJson(layoutJson: string): boolean {
  try {
    const parsed: unknown = JSON.parse(layoutJson);

    if (typeof parsed !== 'object' || parsed === null || !('columns' in parsed))
      return false;

    const layout = parsed as { columns: unknown };

    if (
      !Array.isArray(layout.columns) ||
      !layout.columns.every(
        col =>
          Array.isArray(col) && col.every(widget => isValidPanelWidget(widget)),
      )
    )
      return false;

    return true;
  } catch {
    return false;
  }
}

const schema = new ValidationSchema<ConfigRequestBody>([
  {
    name: 'show_weekday_in_clock',
    fn: value => typeof value.show_weekday_in_clock === 'boolean',
  },
  {
    name: 'weather_api_key',
    fn: value => typeof value.weather_api_key === 'string',
  },
  { name: 'weather_city', fn: value => typeof value.weather_city === 'string' },
  { name: 'layout_json', fn: value => isValidLayoutJson(value.layout_json) },
  { name: 'first_setup', fn: value => typeof value.first_setup === 'boolean' },
]);

export default schema;

import { ValidationSchema } from '@/lib/validation';
import { TimetableRequestBody } from './route';
import { Color } from '@/lib/interpolateColor';

function isValidColor(color: unknown): color is Color {
  if (typeof color !== 'string') return false;
  return /^#([0-9A-F]{3}){1,2}$/i.test(color);
}

function isValidDateString(date: string): boolean {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}

function isValidTimetableEntry(entry: unknown): boolean {
  if (typeof entry !== 'object' || entry === null) return false;

  const typedEntry = entry as {
    id: unknown;
    date: unknown;
    absentTeacher: unknown;
    changes: unknown;
  };

  if (typedEntry.id !== null && typeof typedEntry.id !== 'number') return false;

  if (
    typeof typedEntry.date !== 'string' ||
    !isValidDateString(typedEntry.date)
  )
    return false;

  if (typeof typedEntry.absentTeacher !== 'string') return false;

  if (
    !Array.isArray(typedEntry.changes) ||
    !typedEntry.changes.every(change => typeof change === 'string')
  )
    return false;

  return true;
}

const schema = new ValidationSchema<TimetableRequestBody>([
  {
    name: 'title',
    fn: value => typeof value.title === 'string' && value.title.trim() !== '',
  },
  {
    name: 'color',
    fn: value => isValidColor(value.color),
  },
  {
    name: 'entries',
    fn: value =>
      Array.isArray(value.entries) &&
      value.entries.every(entry => isValidTimetableEntry(entry)),
  },
]);

export default schema;

import { Color } from '@/app/_utils/interpolateColor';

export interface TimetableRow {
  id: number;
  title: string;
  color: Color;
}

export interface TimetableEntryRow {
  id: number;
  timetable_id: number;
  date: string;
  absent_teacher: string;
}

export interface EntryChangeRow {
  id: number;
  entry_id: number;
  change: string;
}

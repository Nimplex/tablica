import { Color } from '@/lib/interpolateColor';

export interface TimetableRow {
  id: number;
  title: string;
  color: Color;
  edited_by: string;
  edited_at: string;
  created_at: string;
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

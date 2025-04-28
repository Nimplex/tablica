import type {
  EntryChangeRow,
  TimetableEntryRow,
  TimetableRow,
} from '@/types/Timetable';
import type { Color } from '@/lib/interpolateColor';
import { getAll, getDatabase, getOne } from '../db';

export class Timetable {
  public entries: TimetableEntry[] = [];

  constructor(
    public id: number | null,
    public title: string,
    public color: Color,
  ) {}

  static fromRow(row: TimetableRow): Timetable {
    return new Timetable(row.id, row.title, row.color);
  }

  insert(): void {
    const stmt = getDatabase().prepare(
      'INSERT INTO timetables (title, color) VALUES (?, ?)',
    );
    const result = stmt.run(this.title, this.color);
    this.id = result.lastInsertRowid as number;

    this.entries.forEach(entry => {
      entry.timetableId = this.id!;
      entry.insert();
    });
  }

  fetchEntries(): void {
    const rows = getAll<TimetableEntryRow>(
      'SELECT id, date, absent_teacher FROM timetable_entries WHERE timetable_id = ?',
      [this.id],
    );

    this.entries = rows.map(row => {
      const entry = TimetableEntry.fromRow(row);
      entry.changes = entry.getChanges();
      return entry;
    });
  }

  fetchChanges(): void {
    this.entries.forEach(entry => (entry.changes = entry.getChanges()));
  }

  static getById(id: number): Timetable | undefined {
    const row = getOne<TimetableRow>('SELECT * FROM timetables WHERE id = ?', [
      id,
    ]);

    if (!row) return undefined;

    const timetable = Timetable.fromRow(row);
    timetable.fetchEntries();
    timetable.fetchChanges();
    return timetable;
  }

  static getAll(): Timetable[] {
    const rows = getAll<TimetableRow>('SELECT * FROM timetables');
    return rows.map(row => {
      const tmp = Timetable.fromRow(row);
      tmp.fetchEntries();
      tmp.fetchChanges();
      return tmp;
    });
  }
}

export class TimetableEntry {
  constructor(
    public id: number | null,
    public timetableId: number,
    public date: Date,
    public absentTeacher: string,
    public changes: string[] = [],
  ) {}

  static fromRow(row: TimetableEntryRow): TimetableEntry {
    return new TimetableEntry(
      row.id,
      row.timetable_id,
      new Date(row.date),
      row.absent_teacher,
    );
  }

  insert(): void {
    const stmt = getDatabase().prepare(`
      INSERT INTO timetable_entries (timetable_id, date, absent_teacher)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(this.timetableId, this.date, this.timetableId);
    this.id = result.lastInsertRowid as number;

    this.changes.forEach(change => {
      getDatabase()
        .prepare(`INSERT INTO entry_changes (entry_id, change) VALUES (?, ?)`)
        .run(this.id, change);
    });
  }

  getChanges(): string[] {
    const result = getDatabase()
      .prepare<
        unknown[],
        EntryChangeRow
      >('SELECT change FROM entry_changes WHERE entry_id = ?')
      .all(this.id);
    return result.map(row => row.change);
  }
}

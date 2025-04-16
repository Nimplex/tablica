import { TextPanelRow } from '@/types/TextPanel';
import { getAll, getDatabase, getOne } from '../db';

export class TextPanel {
  constructor(
    public id: number | null,
    public title: string,
    public content: string,
  ) {}

  static fromRow(row: TextPanelRow): TextPanel {
    return new TextPanel(row.id, row.title, row.content);
  }

  insert(): void {
    const stmt = getDatabase().prepare(
      'INSERT INTO text_panels (title, content) VALUES (?, ?)',
    );
    const result = stmt.run(this.title, this.content);
    this.id = result.lastInsertRowid as number;
  }

  static getById(id: number): TextPanel | undefined {
    const row = getOne<TextPanelRow>('SELECT * FROM text_panels WHERE id = ?', [
      id,
    ]);
    return row ? TextPanel.fromRow(row) : undefined;
  }

  static getAll(): TextPanel[] {
    const rows = getAll<TextPanelRow>('SELECT * FROM text_panels');
    return rows.map(TextPanel.fromRow);
  }
}

import bcrypt from 'bcrypt';
import type { UserRow } from '@/types/User';
import { getDatabase, getOne } from '../db';

export class User {
  constructor(
    public id: number | null,
    public name: string,
    public passwordHash: string,
  ) {}

  static fromRow(row: UserRow): User {
    return new User(row.id, row.name, row.password_hash);
  }

  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.passwordHash);
  }

  async setPassword(newPassword: string): Promise<void> {
    const hash = await bcrypt.hash(newPassword, 10);
    this.passwordHash = hash;

    if (this.id !== null) {
      const stmt = getDatabase().prepare(
        'UPDATE users SET password_hash = ? WHERE id = ?',
      );
      stmt.run(hash, this.id);
    }
  }

  insert(): void {
    const stmt = getDatabase().prepare(
      'INSERT INTO users (name, password_hash) VALUES (?, ?)',
    );
    const result = stmt.run(this.name, this.passwordHash);
    this.id = result.lastInsertRowid as number;
  }

  static getById(id: number): User | undefined {
    const row = getOne<UserRow>('SELECT * FROM users WHERE id = ?', [id]);
    return row ? User.fromRow(row) : undefined;
  }

  static getByUsername(username: string): User | undefined {
    const row = getOne<UserRow>('SELECT * FROM users WHERE name = ?', [
      username,
    ]);
    return row ? User.fromRow(row) : undefined;
  }
}

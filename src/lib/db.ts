/* eslint-disable @typescript-eslint/no-explicit-any */

import Database from 'better-sqlite3';
import { join } from 'path';

const database = new Database(join(process.cwd(), 'data.db'));

export function blacklistToken(token: string): void {
  const stmt = getDatabase().prepare(
    'INSERT INTO blacklisted_tokens (token) VALUES (?)',
  );
  stmt.run(token);
}

export function getDatabase() {
  return database;
}

export function runQuery(query: string, params: any[] = []) {
  const stmt = database.prepare(query);
  return stmt.run(...params);
}

export function getAll<T>(query: string, params: any[] = []) {
  const stmt = database.prepare<unknown[], T>(query);
  return stmt.all(...params);
}

export function getOne<T>(query: string, params: any[] = []) {
  const stmt = database.prepare<unknown[], T>(query);
  return stmt.get(...params);
}

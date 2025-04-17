/* eslint-disable @typescript-eslint/no-explicit-any */

import type { SiteLayout } from '@/types/BoardConfig';
import { Timetable } from './models/Timetable';
import { TextPanel } from './models/TextPanel';

import Database from 'better-sqlite3';
import { join } from 'path';
import { User } from './models/User';

const database = new Database(join(process.cwd(), 'data.db'));

export async function initializeDatabase() {
  // create all
  database.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS timetables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL DEFAULT '',
      color TEXT NOT NULL DEFAULT 'rgb(15, 15, 15)',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS timetable_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timetable_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      absent_teacher TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (timetable_id) REFERENCES timetables(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS entry_changes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entry_id INTEGER NOT NULL,
      change TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (entry_id) REFERENCES timetable_entries(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS text_panels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS board_config (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      show_weekday_in_clock INTEGER NOT NULL DEFAULT 0,
      weather_api_key TEXT NOT NULL DEFAULT '',
      weather_city TEXT NOT NULL DEFAULT '',
      layout_json TEXT NOT NULL DEFAULT '[]',
      first_setup INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE blacklisted_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const adminUser = new User(null, 'administrator', '');
  await adminUser.setPassword('administrator');

  const objectsToInitialize = [
    new Timetable(null, 'Zastępstwa #1', '#8D94BAce'),
    new Timetable(null, 'Zastępstwa #2', '#9A7AA0ce'),
    new Timetable(null, 'Zastępstwa #3', '#87677Bce'),
    new TextPanel(null, 'Głos dyrekcji', ''),
    adminUser,
  ];

  objectsToInitialize.forEach(object => object.insert());

  const defaultLayout: SiteLayout = {
    columns: [
      [
        {
          type: 'timetable',
          id: objectsToInitialize[0].id as number,
        },
        { type: 'weather' },
      ],
      [
        {
          type: 'timetable',
          id: objectsToInitialize[1].id as number,
        },
      ],
      [
        {
          type: 'timetable',
          id: objectsToInitialize[2].id as number,
        },
      ],
      [
        { type: 'text', id: objectsToInitialize[3].id as number },
        { type: 'clock' },
      ],
    ],
  };

  // initialize board_config
  database
    .prepare(
      `
      INSERT INTO board_config (
        id,
        weather_api_key,
        weather_city,
        layout_json
      ) VALUES (1, '', '', ?)
    `,
    )
    .run(JSON.stringify(defaultLayout));
}

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

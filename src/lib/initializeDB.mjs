import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import { join } from 'path';

async function initializeDatabase() {
  const database = new Database(join(process.cwd(), 'data.db'));

  // create all tables
  database.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS timetables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL DEFAULT '',
      color TEXT NOT NULL DEFAULT 'rgb(15, 15, 15)',
      edited_by TEXT DEFAULT 'SYSTEM',
      edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
      edited_by TEXT DEFAULT 'SYSTEM',
      edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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

    CREATE TABLE IF NOT EXISTS blacklisted_tokens (
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

  // setup administrator user
  const passwordHash = await bcrypt.hash('administrator', 10);
  const stmt = database.prepare(
    'INSERT INTO users (name, password_hash) VALUES (?, ?)',
  );
  stmt.run('administrator', passwordHash);

  // setup timetables
  [
    ['Zastępstwa #1', '#8D94BAce'],
    ['Zastępstwa #2', '#9A7AA0ce'],
    ['Zastępstwa #3', '#87677Bce'],
  ].forEach(timetable => {
    const stmt = database.prepare(
      'INSERT INTO timetables (title, color) VALUES (?, ?)',
    );
    stmt.run(timetable[0], timetable[1]);
  });

  // setup text panels
  [['Głos dyrekcji', '']].forEach(textPanel => {
    const stmt = database.prepare(
      'INSERT INTO text_panels (title, content) VALUES (?, ?)',
    );
    stmt.run(textPanel[0], textPanel[1]);
  });

  // setup default layout and board configuration
  const defaultLayout = {
    columns: [
      [
        {
          type: 'timetable',
          id: 1,
        },
        { type: 'weather' },
      ],
      [
        {
          type: 'timetable',
          id: 2,
        },
      ],
      [
        {
          type: 'timetable',
          id: 3,
        },
      ],
      [{ type: 'text', id: 1 }, { type: 'clock' }],
    ],
  };

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

await initializeDatabase();

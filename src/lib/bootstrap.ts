import { initializeDatabase } from './db';
import { BoardConfig } from './models/BoardConfig';

let initialized = false;

export async function ensureInitialized() {
  if (!initialized) {
    try {
      BoardConfig.get();
    } catch {
      await initializeDatabase();
    }
    initialized = true;
  }
}

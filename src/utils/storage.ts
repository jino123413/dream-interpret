import { Storage } from '@apps-in-toss/web-framework';
import { DreamHistory, DreamResult } from '../types';

const STORAGE_KEYS = {
  history: 'dream-interpret-history',
  collection: 'dream-interpret-collection',
  streak: 'dream-interpret-streak',
};

const MAX_HISTORY_LENGTH = 30;

/**
 * Read a value from Storage, falling back to localStorage on failure.
 */
async function getItem(key: string): Promise<string | null> {
  try {
    const val = await Storage.getItem(key);
    return val ?? null;
  } catch {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
}

/**
 * Write a value to Storage, falling back to localStorage on failure.
 */
async function setItem(key: string, value: string): Promise<void> {
  try {
    await Storage.setItem(key, value);
  } catch {
    try {
      localStorage.setItem(key, value);
    } catch {
      // silently fail — best effort persistence
    }
  }
}

/**
 * Get today's date as YYYY-MM-DD string.
 */
function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Get yesterday's date as YYYY-MM-DD string.
 */
function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Create an empty default DreamHistory.
 */
function defaultHistory(): DreamHistory {
  return {
    results: [],
    collectedSymbolIds: [],
    streak: {
      current: 0,
      lastDate: '',
    },
  };
}

/**
 * Load the full dream history from storage.
 */
export async function getDreamHistory(): Promise<DreamHistory> {
  const raw = await getItem(STORAGE_KEYS.history);
  if (!raw) return defaultHistory();

  try {
    const parsed = JSON.parse(raw) as DreamHistory;
    // Ensure structure integrity
    return {
      results: Array.isArray(parsed.results) ? parsed.results : [],
      collectedSymbolIds: Array.isArray(parsed.collectedSymbolIds) ? parsed.collectedSymbolIds : [],
      streak: parsed.streak && typeof parsed.streak.current === 'number'
        ? parsed.streak
        : { current: 0, lastDate: '' },
    };
  } catch {
    return defaultHistory();
  }
}

/**
 * Save a dream result into history.
 * - Keeps max 30 results (oldest trimmed)
 * - Updates collected symbol IDs
 * - Updates the daily streak
 * - Returns the updated history
 */
export async function saveDreamResult(result: DreamResult): Promise<DreamHistory> {
  const history = await getDreamHistory();

  // Prepend new result and trim to max length
  history.results = [result, ...history.results].slice(0, MAX_HISTORY_LENGTH);

  // Collect new symbol IDs
  const collectedSet = new Set(history.collectedSymbolIds);
  for (const symbol of result.matchedSymbols) {
    collectedSet.add(symbol.id);
  }
  history.collectedSymbolIds = Array.from(collectedSet);

  // Update streak
  history.streak = computeStreak(history.streak);

  // Persist
  await setItem(STORAGE_KEYS.history, JSON.stringify(history));

  return history;
}

/**
 * Get the list of all collected symbol IDs.
 */
export async function getCollectedSymbolIds(): Promise<string[]> {
  const history = await getDreamHistory();
  return history.collectedSymbolIds;
}

/**
 * Get current streak data.
 */
export async function getStreak(): Promise<{ current: number; lastDate: string }> {
  const history = await getDreamHistory();
  return history.streak;
}

/**
 * Update streak based on today's date:
 * - If lastDate is yesterday → increment
 * - If lastDate is today → keep (already counted)
 * - Otherwise → reset to 1
 */
export async function updateStreak(): Promise<{ current: number; lastDate: string }> {
  const history = await getDreamHistory();
  history.streak = computeStreak(history.streak);
  await setItem(STORAGE_KEYS.history, JSON.stringify(history));
  return history.streak;
}

/**
 * Pure function that computes the new streak value.
 */
function computeStreak(streak: { current: number; lastDate: string }): { current: number; lastDate: string } {
  const today = getTodayString();
  const yesterday = getYesterdayString();

  if (streak.lastDate === today) {
    // Already counted today — no change
    return streak;
  }

  if (streak.lastDate === yesterday) {
    // Consecutive day — increment
    return {
      current: streak.current + 1,
      lastDate: today,
    };
  }

  // Gap in dates — reset to 1
  return {
    current: 1,
    lastDate: today,
  };
}

import { defaultPreferences, QUALITIES } from '../model/music';
import type { Hand, Preferences } from '../model/types';

export const PREFERENCES_STORAGE_KEY = 'voicing-drill-v1';

export interface PreferencesStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

export function loadPreferences(storage: PreferencesStorage | undefined = browserStorage()): Preferences {
  if (!storage) return defaultPreferences();
  try {
    const saved: unknown = JSON.parse(storage.getItem(PREFERENCES_STORAGE_KEY) || 'null');
    if (!saved || typeof saved !== 'object') return defaultPreferences();

    const value = saved as Partial<Preferences>;
    const defaults = defaultPreferences();
    const q = Array.isArray(value.q)
      ? value.q.filter((id) => QUALITIES.some((quality) => quality.id === id))
      : [];
    const inv = Array.isArray(value.inv)
      ? value.inv.filter((item) => Number.isInteger(item) && item >= 0 && item < 4)
      : [];
    const hand = Array.isArray(value.hand)
      ? value.hand.filter((item): item is Hand => item === 0 || item === 1)
      : [];

    return {
      q: q.length ? q : defaults.q,
      inv: inv.length ? inv : defaults.inv,
      hand: hand.length ? hand : defaults.hand,
      kb: typeof value.kb === 'boolean' ? value.kb : defaults.kb,
    };
  } catch {
    return defaultPreferences();
  }
}

export function savePreferences(
  preferences: Preferences,
  storage: PreferencesStorage | undefined = browserStorage(),
): void {
  try {
    storage?.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // Storage can be unavailable in private browsing; the app still works in memory.
  }
}

function browserStorage(): PreferencesStorage | undefined {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    return undefined;
  }
}
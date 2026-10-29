import { describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_PREFERENCES,
  loadPreferences,
  PREFERENCES_STORAGE_KEY,
  savePreferences,
  type PreferencesStorage,
} from '../../../../src/modules/practice';

function createStorage(value: string | null = null) {
  return {
    getItem: vi.fn(() => value),
    setItem: vi.fn<(key: string, value: string) => void>(),
  } satisfies PreferencesStorage & { setItem: ReturnType<typeof vi.fn<(key: string, value: string) => void>> };
}

describe('practice preference adapter', () => {
  it('returns defaults when there are no saved preferences', () => {
    expect(loadPreferences(createStorage())).toEqual(DEFAULT_PREFERENCES);
  });

  it('loads valid choices and defaults empty selection groups', () => {
    const storage = createStorage(JSON.stringify({ q: ['m9', 'unknown'], inv: [2], hand: [], kb: false }));

    expect(loadPreferences(storage)).toEqual({
      q: ['m9'],
      inv: [2],
      hand: [...DEFAULT_PREFERENCES.hand],
      kb: false,
    });
    expect(storage.getItem).toHaveBeenCalledWith(PREFERENCES_STORAGE_KEY);
  });

  it('recovers from invalid JSON', () => {
    expect(loadPreferences(createStorage('{bad json'))).toEqual(DEFAULT_PREFERENCES);
  });

  it('saves under the legacy-compatible key', () => {
    const storage = createStorage();
    const preferences = { ...DEFAULT_PREFERENCES, q: ['dom9'] };

    savePreferences(preferences, storage);

    expect(storage.setItem).toHaveBeenCalledWith(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  });
});
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
      ...DEFAULT_PREFERENCES,
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

  it('loads progression settings', () => {
    const progression = {
      ...DEFAULT_PREFERENCES.progression,
      key: 8,
      tonality: 'minor',
      dominantQuality: 'dom13b9',
      tempo: 112,
      inversion: 2,
    };
    const storage = createStorage(JSON.stringify({ mode: 'progression', progression }));

    expect(loadPreferences(storage)).toMatchObject({ mode: 'progression', progression });
  });

  it('defaults invalid progression settings safely', () => {
    const storage = createStorage(JSON.stringify({
      mode: 'progression',
      progression: { key: 12, tonality: 'unknown', tempo: 500, dominantQuality: 'unknown' },
    }));

    expect(loadPreferences(storage).progression).toEqual(DEFAULT_PREFERENCES.progression);
  });

  it('defaults a saved minor progression to dominant flat 9 flat 13 when no V quality is saved', () => {
    const storage = createStorage(JSON.stringify({ progression: { tonality: 'minor', inversion: 3 } }));

    expect(loadPreferences(storage).progression.dominantQuality).toBe('dom13b9b13');
    expect(loadPreferences(storage).progression.inversion).toBe(0);
  });

  it('saves under the legacy-compatible key', () => {
    const storage = createStorage();
    const preferences = { ...DEFAULT_PREFERENCES, q: ['dom13b9'] };

    savePreferences(preferences, storage);

    expect(storage.setItem).toHaveBeenCalledWith(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  });
});
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { usePractice } from '../../../../src/modules/practice';

beforeEach(() => localStorage.clear());

describe('usePractice', () => {
  it('owns prompt progression and keyboard visibility', () => {
    const { result } = renderHook(() => usePractice());

    expect(result.current.preferences.kb).toBe(true);
    act(() => result.current.toggleKeyboard());
    expect(result.current.preferences.kb).toBe(false);

    act(() => result.current.nextPrompt());
    expect(result.current.count).toBe(1);
  });

  it('persists preference changes through the storage adapter', () => {
    const { result } = renderHook(() => usePractice());

    act(() => result.current.setPreferences({ ...result.current.preferences, kb: false }));

    expect(JSON.parse(localStorage.getItem('voicing-drill-v1') || 'null')).toMatchObject({ kb: false });
  });
});
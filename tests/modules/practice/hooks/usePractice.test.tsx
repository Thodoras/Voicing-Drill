import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePractice } from '../../../../src/modules/practice';

beforeEach(() => localStorage.clear());
afterEach(() => vi.useRealTimers());

describe('usePractice', () => {
  it('owns prompt progression and keyboard visibility', () => {
    const { result } = renderHook(() => usePractice());

    expect(result.current.preferences.kb).toBe(true);
    act(() => result.current.toggleKeyboard());
    expect(result.current.preferences.kb).toBe(false);

    const firstPrompt = result.current.prompt;
    act(() => result.current.nextPrompt());
    expect(result.current.prompt).not.toBe(firstPrompt);
  });

  it('persists preference changes through the storage adapter', () => {
    const { result } = renderHook(() => usePractice());

    act(() => result.current.setPreferences({ ...result.current.preferences, kb: false }));

    expect(JSON.parse(localStorage.getItem('voicing-drill-v1') || 'null')).toMatchObject({ kb: false });
  });

  it('stops after one ii–V–I pass', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => usePractice());

    act(() => result.current.playProgression());
    expect(result.current.isPlaying).toBe(true);

    act(() => vi.advanceTimersByTime(9000));

    expect(result.current.activeProgressionIndex).toBe(2);
    expect(result.current.isPlaying).toBe(false);
  });
});
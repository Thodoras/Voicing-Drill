import { afterEach, describe, expect, it, vi } from 'vitest';
import { createPrompt, DEFAULT_PREFERENCES, QUALITIES } from '../../../../src/modules/practice';

afterEach(() => vi.restoreAllMocks());

describe('practice model', () => {
  it('spells and stacks a C major ninth in root position', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const prompt = createPrompt({ ...DEFAULT_PREFERENCES, q: ['maj9'], inv: [0], hand: [0] });

    expect(prompt.root).toEqual({ letter: 'C', acc: 0 });
    expect(prompt.midi).toEqual([52, 55, 59, 62]);
  });

  it('respects selected quality, inversion, and hand, including flat-root spelling', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(10 / 12)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    const prompt = createPrompt({ ...DEFAULT_PREFERENCES, q: ['m9'], inv: [2], hand: [1] });

    expect(prompt.q.id).toBe('m9');
    expect(prompt.root).toEqual({ letter: 'B', acc: -1 });
    expect(prompt.inv).toBe(2);
    expect(prompt.hand).toBe(1);
    expect(prompt.midi).toEqual([68, 72, 73, 77]);
  });

  it('prefers A-flat over G-sharp for a minor chord root', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.7)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    const prompt = createPrompt({ ...DEFAULT_PREFERENCES, q: ['m9'], inv: [0], hand: [0] });

    expect(prompt.root).toEqual({ letter: 'A', acc: -1 });
  });

  it('labels minor major-seventh ninth chords as A-flat minor ninth major seventh', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(8 / 12)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    const prompt = createPrompt({ ...DEFAULT_PREFERENCES, q: ['mmaj9'], inv: [0], hand: [0] });

    expect(prompt.root).toEqual({ letter: 'A', acc: -1 });
    expect(prompt.q.sym).toBe('m9(maj7)');
    expect(`${prompt.root.letter}♭${prompt.q.sym}`).toBe('A♭m9(maj7)');
  });

  it('creates a dominant 13 flat 9 with the requested chord tones', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const prompt = createPrompt({ ...DEFAULT_PREFERENCES, q: ['dom13b9'], inv: [0], hand: [0] });

    expect(prompt.q.sym).toBe('13♭9');
    expect(prompt.q.tones).toEqual(['3', '13', 'b7', 'b9']);
    expect(prompt.midi).toEqual([52, 57, 58, 61]);
  });

  it('generates four ascending notes for every supported quality', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    for (const quality of QUALITIES) {
      const prompt = createPrompt({ ...DEFAULT_PREFERENCES, q: [quality.id], inv: [0], hand: [0] });
      expect(prompt.midi).toHaveLength(4);
      expect(prompt.midi).toEqual([...prompt.midi].sort((left, right) => left - right));
    }
  });

  it('rejects empty prompt dimensions', () => {
    expect(() => createPrompt({ ...DEFAULT_PREFERENCES, q: [] })).toThrow(/at least one/i);
  });
});